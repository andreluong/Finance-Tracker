import { Button, Card, CardBody, Image } from '@nextui-org/react'
import { motion } from 'framer-motion';
import NextImage from "next/image";
import { SignUpButton } from '@clerk/nextjs';
import dynamic from 'next/dynamic'
import StatCard from '../ui/stat-card';
import { Icon } from '@iconify/react/dist/iconify.js';

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

function ListItem({
    icon,
    title,
    description
}: { 
    icon: string;
    title: string;
    description: string;
}) {
    return (
        <div className="flex flex-row space-x-4">
            <div className="my-auto">
                <Icon icon={icon} width="3rem" height="3rem" />
            </div>
            <div>
                <p className='text-xl font-bold pb-2'>{title}</p>
                <p className="text-lg">
                    {description.length > 64
                        ? (
                            <>
                                {description.slice(0, 47)}<br />
                                {description.slice(47)}
                            </>
                        )
                        : description}
                </p>
            </div>
        </div>
    );
}

export default function Hero() {
    const features = [
        {
            title: 'Overview',
            description: 'Get a summary of transactions over any period'
        },
        {
            title: 'Analysis',
            description: 'Visualize transactions with interactive charts'
        },
        {
            title: 'Management',
            description: 'Easily manage and update your transactions'
        },
        {
            title: 'Security',
            description: 'Data access is secured and authenticated'
        },
        {
            title: 'Create',
            description: 'Quickly add new transactions with our form'
        },
        {
            title: 'Filter',
            description: 'Apply diverse filters to refine your data view'
        },
        {
            title: 'Receipt Processing',
            description: 'Upload your receipt to automatically create a new transaction'
        },
        {
            title: 'Import/Export',
            description: 'Easily import or export your transactions with CSV files'
        }
    ];

    const workItems = [
        {
            icon: 'lucide:laptop',
            title: 'Effortless sign up',
            description: 'Start your journey for free'
        },
        {
            icon: 'bx:data',
            title: 'Add your transactions',
            description: 'Enter your transactions, upload a receipt, or import a CSV file'
        },
        {
            icon: 'bx:check-circle',
            title: 'Analyze your finances',
            description: 'Get detailed insights into your spending habits'
        },
        {
            icon: 'mdi:hand-heart-outline',
            title: 'Enjoy less stress',
            description: 'Simplify spending and saving and start feeling confident in your financial decisions' 
        }
    ];

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
                    height={1100}
                    width={1100}
                    src='/assets/images/hero.png'
                    alt='Finance Tracker hero image'
                />
            </motion.div>
            <div className='flex flex-col items-center'>
                <p className='text-4xl font-bold mb-8'>
                    Keep Track Of Your Finances With Ease
                </p>
                <div>
                    <div className='flex justify-between mb-20'>
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
                        <Card className='bg-zinc-100 p-8 hover:bg-white'>
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
            <div className='flex flex-col items-center my-24'>
                <p className='text-4xl font-bold mb-8'>How Finance Tracker Works</p>
                <div className='flex flex-row'>
                    <div className='mx-10 space-y-6'>
                        {workItems.map((item) => (
                            <ListItem 
                                icon={item.icon}
                                title={item.title}
                                description={item.description}
                            />
                        ))}
                    </div>
                    <Image
                        as={NextImage}
                        height={600}
                        width={800}
                        src='/assets/images/overview.png'
                        alt='Finance Tracker overview'
                    />
                </div>
            </div>
            <div className='flex flex-col items-center my-24'>
                <p className='text-4xl font-bold mb-8'>Features</p>
                <FadeInWhenVisible>
                    <div className='grid grid-cols-4 grid-rows-2 gap-12 border border-zinc-200 rounded-xl p-10 shadow-lg max-w-7xl'>
                        {features.map((feature) => (
                            <FeatureCard
                                title={feature.title}
                                description={feature.description}
                            />
                        ))}
                    </div>
                </FadeInWhenVisible>
            </div>
        </div>
    )
}
