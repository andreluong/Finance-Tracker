import { Button, Card, CardBody, Image } from '@nextui-org/react'
import { motion } from 'framer-motion';
import NextImage from "next/image";
import { SignUpButton } from '@clerk/nextjs';
import dynamic from 'next/dynamic'
import { Icon } from '@iconify/react/dist/iconify.js';
import EmblaCarousel from './embla-carousel';

const DonutChart = dynamic(() => import('./donut-chart'), { ssr: false });

function FeatureCard({
    icon,
    title,
    description,
}: {
    icon: string;
    title: string;
    description: string;
}) {
    return (
        <Card className="bg-emerald-300 p-8" shadow="none">
            <CardBody className='space-y-2'>
                <Icon icon={icon} width="3rem" height="3rem"/>
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

const Headline = () => {
    return (
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
                className='relative z-0'
            />
        </motion.div>     
    );
}

const Subheading = () => {
    const slides = [
        {
            title: 'Visualize your Spending',
            description: 'Check your spending habits with our interactive charts.',
            content: <DonutChart />  
        },
        {
            title: 'Categorize your Transactions',
            description: 'Use unique categories to organize your transactions.',
            content: 
                <Image 
                    as={NextImage}
                    height={400}
                    width={800}
                    src='/assets/images/category-stats.png' 
                    alt='Finance Tracker category stats' 
                />
        },
        {
            title: 'Insightful Statistics',
            description: 'Our statistics provide a detailed overview of your finances.',
            content: 
                <Image 
                    as={NextImage}
                    height={400}
                    width={800}
                    src='/assets/images/statistics.png' 
                    alt='Finance Tracker statistics page' 
                />
        },
        {
            title: 'Smart Receipt Processing',
            description: 'Use AI to process your receipts and automatically create transactions.',
            content: 
            <div className='mx-auto border border-zinc-300'>
                <Image 
                    as={NextImage}
                    height={210}
                    width={210}
                    src='/assets/images/receipt-processing.jpg' 
                    alt='Finance Tracker receipt processing' 
                />
            </div>
        }
    ];

    return (
        <div className='flex flex-col items-center bg-emerald-300'>
            <p className='text-4xl font-bold mb-8 z-10'>
                Manage your Finances with Ease
            </p>
            <EmblaCarousel slides={slides} />
        </div>
    );
}

const Workings = () => {
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
        <div className='flex flex-col items-center mb-24'>
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
    );
}

const Features = () => {
    const features = [
        {
            icon: 'lucide:home',
            title: 'Overview',
            description: 'Quick summary of all transactions over any month and year'
        },
        {
            icon: 'tabler:receipt',
            title: 'Smart Receipt Processing',
            description: 'Upload your receipt and let Gemini AI handle the rest. Your receipt will be deleted after processing'
        },
        {
            icon: 'lucide:credit-card',
            title: 'Transaction Management',
            description: 'Easily manage and update your transactions with our user-friendly interface and convenient filters'
        },
        {
            icon: 'lucide:bar-chart-3',
            title: 'Visualize Trends',
            description: 'Get detailed insights of your finances in real time'
        },
        {
            icon: 'tabler:file-type-csv',
            title: 'Import/Export with CSV',
            description: 'Easily import or export your transactions with CSV files'
        }
    ];

    return (
        <div className='flex flex-col items-center my-24'>
            <p className='text-4xl font-bold mb-8'>Features</p>
            <div className='grid grid-cols-3 grid-rows-2 gap-12 max-w-7xl'>
                {features.map((feature) => (
                    <FeatureCard
                        icon={feature.icon}
                        title={feature.title}
                        description={feature.description}
                    />
                ))}
            </div>
        </div>
    );
}

export default function Hero() {
    return (
        <div>
            <svg 
                viewBox="0 0 1440 320" 
                className='absolute h-screen w-full top-80 xl:top-96'
            >
                <path fill="#6ee7b7" fill-opacity="1" d="M0,0L48,16C96,32,192,64,288,69.3C384,75,480,53,576,74.7C672,96,768,160,864,170.7C960,181,1056,139,1152,122.7C1248,107,1344,117,1392,122.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z" />
            </svg>
            <Headline />
            <Subheading />
            <svg viewBox="0 0 1440 220">
                <path fill="#6ee7b7" fill-opacity="1" d="M0,160L48,176C96,192,192,224,288,213.3C384,203,480,149,576,112C672,75,768,53,864,64C960,75,1056,117,1152,138.7C1248,160,1344,160,1392,160L1440,160L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z" />
            </svg>
            <Workings />
            <Features />
        </div>
    );
}
