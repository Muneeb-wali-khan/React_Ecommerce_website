import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";

function Banner() {
  const banners = [
    {
      title: "Best Collection of 2025 Shoes New Design",
      subtitle:
        "New design shoes with a modern feel and long-lasting comfort at a great price.",
      imageUrl: "/banner1.jpg",
    },
    {
      title: "Stylish Tech Gadgets for 2025",
      subtitle:
        "Explore the latest tech gadgets with cutting-edge features and sleek designs.",
      imageUrl: "/banner2.jpg",
    },
    {
      title: "Fashion Trends for 2025",
      subtitle:
        "Stay ahead with the latest fashion trends that combine comfort and style.",
      imageUrl: "/banner3.jpg",
    },
  ];

  return (
    <div>
      {/* Banner Carousel */}
      <div className="relative w-full h-96">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-950 via-transparent to-gray-950 z-10"></div>
        <Swiper
          modules={[Autoplay, Navigation, Pagination]}
          spaceBetween={30}
          centeredSlides={true}
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
          }}
          loop={true}
          navigation={false}
          pagination={{ clickable: true }}
          className="h-full"
        >
          {banners.map((banner, index) => (
            <SwiperSlide key={index}>
              <div className="h-full w-full relative">
                <img
                  src={banner.imageUrl}
                  alt={`${banner.imageUrl}`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-950 z-20">
                  <h2 className="text-4xl font-bold drop-shadow-lg">
                    {`${banner.title}`}
                  </h2>
                  <p className="mt-2 text-lg">{`${banner.subtitle}`}</p>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Welcome Text */}
      <div className="p-6">
        <h1 className="text-3xl font-bold">Welcome to es-Shop</h1>
        <p className="mt-4 text-lg">
          Browse our collection of products, manage your cart, and update your
          profile.
        </p>
      </div>
    </div>
  );
}

export default Banner;
