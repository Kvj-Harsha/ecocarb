"use client";

import Image from "next/image";
import React from "react";
import { CardBody, CardContainer, CardItem } from "../components/ui/3d-card";
import Link from "next/link";

const cardsData = [
  {
    title: "Carbon Emission",
    description: "By using Machine Learning models we are finding carbon emission for different vehicles",
    image: "/carem.jpg",
    link: "/home",
    buttonText: "Explore More",
  },
  {
    title: "Driving pattern Analysis",
    description: "By using Machine Learning models we are defining driving behaviours.",
    image: "/drivingpatt.jpg",
    link: "/home",
    buttonText: "Check Deals",
  },
  {
    title: "AI-Insights",
    description: "By using Gemini Api we are giving useful insights to the User",
    image: "/ai.jpg",
    link: "/home",
    buttonText: "Track Now",
  },
];

export default function ThreeDCardDemo() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6 bg-black">
      {cardsData.map((card, index) => (
        <CardContainer key={index} className="inter-var">
          <CardBody
            className="bg-gray-50 relative group/card dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] dark:bg-black dark:border-white/[0.2] border-black/[0.1] w-auto sm:w-[30rem] h-auto rounded-xl p-6 border"
          >
            <CardItem
              translateZ="50"
              className="text-xl font-bold text-neutral-600 dark:text-white"
            >
              {card.title}
            </CardItem>
            <CardItem
              as="p"
              translateZ="60"
              className="text-neutral-500 text-sm max-w-sm mt-2 dark:text-neutral-300"
            >
              {card.description}
            </CardItem>
            <CardItem translateZ="100" className="w-full mt-4">
              <Image
                src={card.image}
                height="1000"
                width="1000"
                className="h-60 w-full object-cover rounded-xl group-hover/card:shadow-xl"
                alt="thumbnail"
              />
            </CardItem>
            <div className="flex justify-between items-center mt-20">
              <CardItem
                translateZ={20}
                as={Link}
                href={card.link}
                target="__blank"
                className="px-4 py-2 rounded-xl text-xs font-normal dark:text-white"
              >
                Try now →
              </CardItem>
              <CardItem
                translateZ={20}
                as="button"
                className="px-4 py-2 rounded-xl bg-black dark:bg-white dark:text-black text-white text-xs font-bold"
              >
                {card.buttonText}
              </CardItem>
            </div>
          </CardBody>
        </CardContainer>
      ))}
    </div>
  );
}
