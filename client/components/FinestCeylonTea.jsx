import React from "react";
import { Italiana, Julius_Sans_One } from "next/font/google";
import Image from "next/image";

const italiana = Italiana({
  weight: "400", // Italiana only comes with regular weight (400)
  subsets: ["latin"],
});

const juliusSansOne = Julius_Sans_One({
  weight: "400", // Julius Sans One only has a regular weight
  subsets: ["latin"],
});

function FinestCeylonTea() {
  return (
    <section className="bg-babout py-16 ">
      <div className="container mx-auto">
        <div className="px-8 py-4 sm:px-6 lg:px-96">
          <div className="text-center text-white">
            <div className={italiana.className}>
              <h2 className="text-[28px] md:text-[44px] ">Finest Ceylon Tea</h2>
            </div>
            <div className="relative flex justify-center my-8">
              <Image
                src="/assets/images/factory-fresh-gold-02.webp"
                alt="Factory Fresh | Tea Jar Icon"
                className="object-contain h-16 md:h-24"
                height={100}
                width={100}
              />
            </div>

            <div className={juliusSansOne.className}>
              <p className="leading-6 md:leading-8 mt-4 max-w-2xl mx-auto text-[15px] md:text-[22px]">
                Our single-origin Ceylon teas are ethically sourced and crafted
                to ensure factory-fresh quality, reflecting the rich heritage
                and values of Ceylon tea. Enjoy the true essence of Ceylon tea
                with Tea Jar.
              </p>
            </div>
          </div>
        </div>

        <div className={italiana.className}>
          <div className="flex justify-center items-start space-x-6 px-10 gap-0 md:gap-4">
            <div className="flex flex-col items-center hover:scale-110 duration-200 py-2 my-2">
              <Image
                src="/assets/images/fct1-2.webp"
                alt="Ethically Grown"
                className="object-contain h-16 md:h-24"
                height={100}
                width={100}
              />
              <p className="mt-2 text-[15px] md:text-[20px] text-white text-center">
                Ethically Grown
              </p>
            </div>

            <div className="flex flex-col items-center hover:scale-110 duration-200 py-2 my-2">
              <Image
                src="/assets/images/fct2-0s1.webp"
                alt="Hand Picked"
                className="object-contain h-16 md:h-24"
                height={100}
                width={100}
              />
              <p className="mt-2 text-[15px] md:text-[20px] text-white text-center">
                Hand Picked
              </p>
            </div>

            <div className="flex flex-col items-center hover:scale-110 duration-200 py-2 my-2">
              <Image
                src="/assets/images/factory-fresh-02.webp"
                alt="Factory Fresh"
                className="object-contain h-18 md:h-24"
                height={100}
                width={100}
              />
              <p className="-m-4 md:mt-2 text-[15px] md:text-[20px] text-white text-center">
                Factory Fresh
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default FinestCeylonTea;
