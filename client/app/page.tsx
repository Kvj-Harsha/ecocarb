import React from 'react'
import Navbar from './components/Navbar'
import ThreeDCardDemo from './components/card';
import Hero from './components/Hero';

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