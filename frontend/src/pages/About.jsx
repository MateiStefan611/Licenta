import Title from "../components/Title";


import NewsletterBox from "../components/NewsletterBox";

const About = () => {
  return (
    <div>
      <div className="text-2xl text-center pt-8 border-t">
        <Title text1={"ABOUT"} text2={"US"} />
      </div>

      <div className="my-10 flex flex-col md:flex-row gap-16">
        <img
          src="/about_img.png"
          className="w-full md:max-w-[450px]"
          alt=""
        />
        <div className="flex flex-col justify-center gap-6 md:w-2/4 text-gray-600">
          <p>
            At Forever, we believe that fragrance is more than just a scent — it’s an experience, a memory, a statement. Founded with a passion for quality and 
            elegance, we carefully select each perfume to offer you only the finest aromas from around the world. Our mission is to help you discover and celebrate 
            your unique identity through exquisite fragrances that linger in the heart and mind.
          </p>

          <b className="text-gray-800">Our Mission</b>
          <p>
            To inspire confidence and self-expression by providing high-quality, captivating fragrances that enhance every moment. 
            We are committed to exceptional customer experience, authenticity, and bringing the art of perfume closer to you.
          </p>
        </div>
      </div>

      <div className="text-xl py-4">
        <Title text1={"WHY"} text2={"CHOOSE US"} />
      </div>

      <div className="flex flex-col md:flex-row text-sm mb-20">
        <div className="border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5">
          <b>Quality Assurance:</b>
          <p className="text-gray-600">
            We meticulously select and vet each product to ensure it meets our
            stringent quality standard.
          </p>
        </div>
        <div className="border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5">
          <b>Convenience:</b>
          <p className="text-gray-600">
            With our user-friendly interface and hassle-free ordering process,
            shopping fas never been easier.
          </p>
        </div>
        <div className="border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5">
          <b>Exceptional Customer Service:</b>
          <p className="text-gray-600">
            Our team of dedicated professionals is here to assist you the way,
            ensuring your satisfaction is our top priority
          </p>
        </div>
      </div>

      <NewsletterBox />
    </div>
  );
};

export default About;
