const database = require("../database/db");

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

async function parseReceipt(data) {
    console.log("Parsing receipt...");

    const category = data.category; // TODO: Map to our categories
    const purchase_date = data.date || data.due_date || data.order_date || data.created_date;

    const items = data.line_items?.map((item) => {
        return {
            name: item.description,
            quantity: item.quantity,
            amount: item.total,
        };
    });
    const payment = {
        payment_type: data.payment?.display_name,
        subtotal: data.subtotal,
        tax: data.tax,
        tip: data.tip,
        total: data.total,
    };
    const vendor = {
        name: data.vendor?.name,
        address: data.vendor?.address,
        phone: data.vendor?.phone_number,
        email: data.vendor?.email,
        web: data.vendor?.web,
    };

    console.log("Receipt parsed successfully")

    return { vendor, payment, items, purchase_date };
}

async function createTransactionFromReceipt(
    vendor,
    payment,
    items,
    purchase_date,
    user_id
) {
    console.log("Creating transaction from receipt...");

    const vendorDescription = 
    `
    Vendor: ${vendor.name || "N/A"}
    Address: ${vendor.address || "N/A"}
    Phone: ${vendor.phone || "N/A"}
    Email: ${vendor.email || "N/A"}
    Web: ${vendor.web || "N/A"}
    `

    const itemsDescription = items.map((item) => {
        return `
        Name: ${item.name || "N/A"}
        Quantity: ${item.quantity || '-'}
        Amount: ${item.amount || '-'}
        `;
    });

    const paymentDescription = 
    `
    Payment Type: ${payment.payment_type || "N/A"}
    Subtotal: ${payment.subtotal || 0}
    Tax: ${payment.tax || 0}
    Tip: ${payment.tip || 0}
    Total: ${payment.total}
    `;

    try {
        const newTransaction = {
            name: vendor.name || "Receipt",
            amount: payment.total,
            description: 
                `
                ${vendorDescription}
                items:
                ${itemsDescription}
                ${paymentDescription}
                `,
            type: "expense",
            category: 12, // TODO: Map to our categories. Currently is set to Miscellaneous Expense
            date: purchase_date,
            user_id,
        }
        await database.transaction.create(newTransaction);
    } catch (error) {
        console.error(error.message);
        throw new Error("Error creating transaction from receipt");
    }

    console.log("Transaction created from receipt");
}

module.exports = {
    createTransaction,
    parseReceipt,
    createTransactionFromReceipt,
};
