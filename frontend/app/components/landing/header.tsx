import { SignInButton, SignUpButton } from '@clerk/nextjs'
import { Icon } from '@iconify/react/dist/iconify.js'
import { Button, Link, Navbar, NavbarBrand, NavbarContent, NavbarItem } from '@nextui-org/react'
import React from 'react'

export default function Header() {
    return (
        <Navbar isBordered>
            <NavbarBrand className='font-bold text-2xl'>
                <Icon icon="material-symbols:azm-rounded" color='#34d399' fontSize={30} />
                <p>Finance Tracker</p>            
            </NavbarBrand>
            <NavbarContent className="hidden sm:flex gap-4" justify="end">
                <NavbarItem>
                    <SignInButton mode='modal'>
                        Sign In
                    </SignInButton>
                </NavbarItem>
                <NavbarItem>
                    <SignUpButton mode='modal'>
                        <Button className='bg-emerald-400 font-sans hover:bg-emerald-300'>
                            Sign Up
                        </Button>
                    </SignUpButton>
                </NavbarItem>
            </NavbarContent>
        </Navbar>
    )
}
