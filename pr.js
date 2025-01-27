

const images = [
  {
    url: "https://res.cloudinary.com/djl7cctgm/image/upload/v1737981823/products/mesfytzi8pxzayxqeeix.jpg",
    _id: "67977f80d83d6a5ff583c3f2",
  },
  {
    url: "https://res.cloudinary.com/djl7cctgm/image/upload/v1737981821/products/oqzhomwd43kgjqtmngok.jpg",
    _id: "67977f80d83d6a5ff583c3f3",
  },
  {
    url: "https://res.cloudinary.com/djl7cctgm/image/upload/v1737981823/products/i4wtz0fixtg6nskhafoq.png",
    _id: "67977f80d83d6a5ff583c3f4",
  },
];

function extractIdProductsImages(urls){
    const images = urls?.map((url)=>{
        const avatar  = url?.url?.split("/")
        const publicId = avatar[8]?.split('.')
        return publicId[0]
    })

    return images
}
const ids = extractIdProductsImages(images)

console.log(ids);
