import React from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import ThreeDCardDemo from './components/card';

const page = () => {
  return (
    <section>
      <Navbar/>
      <Hero/>
      <ThreeDCardDemo />
    </section>
  )
}

export default page