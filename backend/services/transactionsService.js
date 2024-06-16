const database = require("../database/db");

// Gemini API
const GoogleGenerativeAI = require('@google/generative-ai').GoogleGenerativeAI;
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash"});

// Google Cloud Storage
const { Storage } = require('@google-cloud/storage');
const storage = new Storage({
    projectId: process.env.GOOGLE_PROJECT_ID
});
const bucket = storage.bucket(process.env.GCS_BUCKET_NAME);

async function uploadToBucket(file) {
    const newFilename = Date.now().toString() + file.originalname;

    try {
        await bucket
            .file(newFilename)
            .save(file.buffer, { contentType: file.mimetype });

        console.log(`File uploaded to GCS: ${file.originalname}`);

        return newFilename;
    } catch (error) {
        console.error(error.message);
        throw new Error("Error uploading file to bucket");
    }
}

// Delete from bucket
async function deleteFromBucket(filename) {
    try {
        await bucket.file(filename).delete();
        console.log(`File deleted from GCS: ${filename}`);
    } catch (error) {
        console.error(error.message);
        throw new Error("Error deleting file from bucket")
    }
}

async function createTransaction(
    name,
    amount,
    description,
    type,
    category,
    date,
    user_id
) {
    try {
        await database.transaction.create({
            name,
            amount,
            description,
            type,
            category,
            date,
            user_id,
        });
    } catch (error) {
        console.error(error.message);
        throw new Error("Error creating transaction");
    }
}

// Extracts information from a receipt image using the Gemini API
async function extractReceipt(imageBase64) {
    const categoryList = await database.category.getAllDynamically("expense");

    const promptConfig = [
        {
            text: `
            From this image of a receipt, I need you to extract information regarding:
            - "category", the category of the overall receipt. It must be one of the categories in the system: 
                ${categoryList.map((cat) => cat.name).join(", ")}.
            - "date", the date of the purchase, in the format, "YYYY-MM-DD".
            - "items", the items purchased. Create this as an object with the name of the item, quantity (include the unit of measure with quantity if found), and amount.
            - "payment", The payment details. Create this as an object with the payment type, subtotal, tax, tip, and total amount.
            - "vendor", The vendor details. Create this as an object with the name, address, phone number, email, and website.
            Return just the extracted information in json format.
            If no information can be extracted or the image is not a receipt, return an empty object.
            `,
        },
        {
            inlineData: {
                mimeType: "image/jpeg",
                data: imageBase64,
            },
        },
    ];

    const result = await model.generateContent({
        contents: [{ role: "user", parts: promptConfig }],
    });
    const response = result.response;

    // Remove header and footer from response
    const data = response.text().split("\n").slice(1, -1).join("\n");

    return JSON.parse(data);
}

// Processes a receipt image by extracting information and creating a transaction
async function processReceipt(imageBase64, user_id) {
    console.log("Processing receipt...");
    
    try {
        const receiptData = await extractReceipt(imageBase64);
        const category = await database.category.getIdByNameOrValue(receiptData.category);

        await createTransactionFromReceipt(
            receiptData.vendor,
            receiptData.payment,
            receiptData.items,
            category,
            receiptData.date,
            user_id
        );

        console.log("Successfully processed receipt");
    } catch (error) {
        console.error(error.message);
        throw new Error("Error processing receipt");
    }
}

// Creates a transaction from the extracted receipt information
async function createTransactionFromReceipt(
    vendor,
    payment,
    items,
    category,
    date,
    user_id
) {
    console.log("Creating transaction from receipt...");

    const vendorDescription = `
        Vendor: ${vendor.name || "N/A"}
        Address: ${vendor.address || "N/A"}
        Phone: ${vendor.phone_number || "N/A"}
        Email: ${vendor.email || "N/A"}
        Web: ${vendor.website || "N/A"}
    `;

    const itemsDescription = items.map((item) => {
        return `
          Name: ${item.name || "N/A"}
          Quantity: ${item.quantity || "-"}
          Amount: ${item.amount || "-"}
        `;
    });

    const paymentDescription = `
        Payment Type: ${payment.payment_type || "N/A"}
        Subtotal: ${payment.subtotal || 0}
        Tax: ${payment.tax || 0}
        Tip: ${payment.tip || 0}
        Total: ${payment.total}
    `;

    const newTransaction = {
        name: vendor.name || "Receipt",
        amount: payment.total || payment.subtotal,
        description: `
            ${vendorDescription}

            items:
            ${itemsDescription.join('\n')}

            ${paymentDescription}
        `,
        type: "expense",
        category,
        date,
        user_id
    };

    try {
        await database.transaction.create(newTransaction);
        console.log("Transaction created from receipt");
    } catch (error) {
        console.error(error.message);
        throw new Error("Error creating transaction from receipt");
    }
}

module.exports = {
    uploadToBucket,
    deleteFromBucket,
    createTransaction,
    processReceipt
};
