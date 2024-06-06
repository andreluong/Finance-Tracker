import React from 'react'
import Header from './landing/header'
import Hero from './landing/hero'
import Footer from './landing/footer'

export default function Landing() {
    return (
        <div className='bg-zinc-50'>
            <Header />
            <Hero />
            <Footer />
        </div>
    )
}
