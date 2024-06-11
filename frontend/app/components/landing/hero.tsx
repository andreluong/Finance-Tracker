import { Button, Card, CardBody, Image } from '@nextui-org/react'
import { motion } from 'framer-motion';
import NextImage from "next/image";
import { SignUpButton } from '@clerk/nextjs';
import dynamic from 'next/dynamic'

const DonutChart = dynamic(() => import('./donut-chart'), { ssr: false });

function FadeInWhenVisible({ children }: { children: React.ReactNode }) {
    return (
        <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ ease: "easeOut", duration: 0.5 }}
            variants={{
                visible: { opacity: 1, scale: 1 },
                hidden: { opacity: 0, scale: 0.6 },
            }}
            className="flex flex-grow-0"
        >
            {children}
        </motion.div>
    );
}

function FeatureCard({
    title,
    description,
}: {
    title: string;
    description: string;
}) {
    return (
        <Card className="bg-emerald-100 p-8 hover:bg-white" shadow="none">
            <CardBody>
                <p className="text-xl font-bold">{title}</p>
                <p>{description}</p>
            </CardBody>
        </Card>
    );
}

export default function Hero() {
    return (
        <div>
            <motion.div 
                className='flex flex-col items-center justify-center h-screen'
                initial={{ opacity: 0, scale: 0.7, y: 50 }}
                animate={{ opacity: 1, scale: 1, y: -50 }}
                transition={{ duration: 0.6 }}
            >
                <p className='font-bold text-5xl my-8'>
                    Comprehensive Finance Tracking
                </p>
                <SignUpButton mode='modal' >
                    <Button
                        className='bg-emerald-400 text-2xl font-sans mb-8 hover:bg-emerald-300'
                        size='lg'
                    >
                        Get Started
                    </Button>
                </SignUpButton>
                <Image
                    as={NextImage}
                    height={1000}
                    width={1000}
                    src='/assets/images/hero.png'
                    alt='Finance Tracker hero image'
                />
            </motion.div>
            <div className='flex flex-col items-center'>
                <p className='text-4xl font-bold mb-8'>
                    Keep Track Of Your Finances With Ease
                </p>
                <div className='mb-8'>
                    <div className='flex justify-between my-20 mt-12'>
                        <FadeInWhenVisible>
                            <Card className='bg-zinc-100 p-8 hover:bg-white'>
                                <CardBody>
                                        <p className='text-2xl font-bold mx-auto my-2'>Visualize Your Data</p>
                                        <DonutChart />
                                </CardBody>
                            </Card>
                        </FadeInWhenVisible>
                        <FadeInWhenVisible>
                            <Card className='bg-zinc-100 p-8 hover:bg-white'>
                                <CardBody>
                                        <p className='text-2xl font-bold mx-auto my-2'>Categorize Your Transactions</p>
                                        <Image
                                            as={NextImage}
                                            height={600}
                                            width={600}
                                            src='/assets/images/category-stats.png'
                                            alt='Finance Tracker category stats'
                                        />
                                </CardBody>
                            </Card>
                        </FadeInWhenVisible>
                    </div>
                    <FadeInWhenVisible>
                        <Card className='bg-zinc-100 p-8 my-8 hover:bg-white'>
                            <CardBody>
                                <p className='text-2xl font-bold mx-auto my-2'>View All Your Transactions</p>
                                <Image
                                    as={NextImage}
                                    height={1000}
                                    width={1200}
                                    src='/assets/images/transactions-table.png'
                                    alt='Finance Tracker transactions table'
                                />
                            </CardBody>
                        </Card>
                    </FadeInWhenVisible>
                </div>
            </div>
            <div className='flex flex-col items-center mb-24'>
                <p className='text-4xl font-bold mb-8'>Features</p>
                <FadeInWhenVisible>
                    <div className='grid grid-cols-4 grid-rows-2 gap-12 border border-zinc-200 rounded-xl p-10 shadow-lg max-w-7xl'>
                        <FeatureCard
                            title='Overview'
                            description='Get a summary of transactions over any period'
                        />
                        <FeatureCard
                            title='Analysis'
                            description='Visualize transaction data with interactive charts'    
                        />
                        <FeatureCard
                            title='Management'
                            description='Easily manage and update your transactions'
                        />
                        <FeatureCard
                            title='Security'
                            description='Data access is secured and authenticated'
                        />
                        <FeatureCard
                            title='Create'
                            description='Quickly add new transactions with our form'
                        />
                        <FeatureCard
                            title='Filter'
                            description='Apply diverse filters to refine your data view'
                        />
                        <FeatureCard
                            title='Receipt Processing'
                            description='Upload your receipt to automatically create a new transaction'
                        />
                        <FeatureCard
                            title='Import/Export'
                            description='Easily import or export your transactions with CSV files'
                        />
                    </div>
                </FadeInWhenVisible>
            </div>
        </div>
    )
}
