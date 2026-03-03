import { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";

import Title from "../components/Title";
import ProductItem from "../components/ProductItem";

const Collection = () => {
  const { products, search, showSearch } = useContext(ShopContext);

  const [showFilter, setShowFilter] = useState(false);
  const [filterProducts, setFilterProducts] = useState([]);
  const [category, setCategory] = useState([]);
  const [type, setType] = useState([]);
  const [subCategory, setSubCategory] = useState([]);
  const [sortType, setSortType] = useState("relevant");

  // Afișăm 12 produse la început și la "vezi mai multe" creștem limita
  const [visibleCount, setVisibleCount] = useState(12);

  const toggleCategory = (e) => {
    const value = e.target.value;
    if (category.includes(value)) {
      setCategory((p) => p.filter((item) => item !== value));
    } else {
      setCategory((p) => [...p, value]);
    }
  };

  const toggleSubCategory = (e) => {
    const value = e.target.value;
    if (subCategory.includes(value)) {
      setSubCategory((p) => p.filter((item) => item !== value));
    } else {
      setSubCategory((p) => [...p, value]);
    }
  };

  const toggleType = (e) => {
    const value = e.target.value;
    if (type.includes(value)) {
      setType((prev) => prev.filter((item) => item !== value));
    } else {
      setType((prev) => [...prev, value]);
    }
  };

  const applyFilter = () => {
    let productsCopy = products.slice();

    if (showSearch && search) {
      productsCopy = productsCopy.filter((item) =>
        item.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (category.length > 0) {
      productsCopy = productsCopy.filter((item) =>
        category.includes(item.category)
      );
    }

    if (subCategory.length > 0) {
      productsCopy = productsCopy.filter((item) =>
        subCategory.some(
          (filterVal) =>
            filterVal.toLowerCase().trim() === item.subCategory.toLowerCase().trim()
        )
      );
    }

    if (type.length > 0) {
      productsCopy = productsCopy.filter((item) =>
        type.includes(item.type)
      );
    }

    setFilterProducts(productsCopy);
  };

  const sortProduct = () => {
    let fpCopy = filterProducts.slice();

    switch (sortType) {
      case "low-high":
        setFilterProducts(fpCopy.sort((a, b) => a.price - b.price));
        break;

      case "high-low":
        setFilterProducts(fpCopy.sort((a, b) => b.price - a.price));
        break;

      default:
        applyFilter();
        break;
    }
  };

  // Resetăm numărul vizibil de produse la schimbarea filtrelor, căutării sau produselor
  useEffect(() => {
    applyFilter();
    setVisibleCount(12);
  }, [category, subCategory, type, search, showSearch, products]);

  useEffect(() => {
    sortProduct();
  }, [sortType]);

  return (
    <div className="flex flex-col sm:flex-row gap-1 sm:gap-10 pt-10 border-t">
      {/* FILTER OPTIONS */}
      <div className="min-w-60 rounded-2xl">
        <p
          onClick={() => setShowFilter(!showFilter)}
          className="my-2 text-xl flex items-center cursor-pointer gap-2 "
        >
          FILTERS
          <img
            src="/dropdown_icon.png"
            className={`h-3 sm:hidden ${showFilter ? "rotate-90" : ""}`}
            alt=""
          />
        </p>
        {/* CATEGORY FILTER */}
        <div
          className={`border rounded-2xl border-gray-300 pl-5 py-3 mt-6 ${
            showFilter ? " " : "hidden"
          } sm:block`}
        >
          <p className="mb-3 text-sm font-medium ">Categories</p>
          <div className="flex flex-col gap-2 text-sm font-light text-gray-700">
            <p className="flex gap-2">
              <input
                className="w-3"
                type="checkbox"
                value={"Men"}
                onChange={toggleCategory}
              />{" "}
              Men
            </p>
            <p className="flex gap-2">
              <input
                className="w-3"
                type="checkbox"
                value={"Women"}
                onChange={toggleCategory}
              />{" "}
              Women
            </p>
          </div>
        </div>

        {/* SUBCATEGORIES FILTER */}
        <div
          className={`border rounded-2xl border-gray-300 pl-5 py-3 my-5 ${
            showFilter ? " " : "hidden"
          } sm:block`}
        >
          <p className="mb-3 text-sm font-medium">Sub category</p>
          <div className="flex flex-col gap-2 text-sm font-light text-gray-700">
            <p className="flex gap-2">
              <input
                className="w-3"
                type="checkbox"
                value={"Parfum"}
                onChange={toggleSubCategory}
              />{" "}
              Parfum
            </p>
            <p className="flex gap-2">
              <input
                className="w-3"
                type="checkbox"
                value={"Eau de parfum"}
                onChange={toggleSubCategory}
              />{" "}
              Eau de parfum
            </p>
            <p className="flex gap-2">
              <input
                className="w-3"
                type="checkbox"
                value={"Eau de toilette"}
                onChange={toggleSubCategory}
              />{" "}
              Eau de toilette
            </p>
          </div>
        </div>

        {/* TYPES */}
        <div
          className={`border rounded-2xl border-gray-300 pl-5 py-3 my-5 ${
            showFilter ? " " : "hidden"
          } sm:block`}
        >
          <p className="mb-3 text-sm font-medium">Types</p>
          <div className="flex flex-col gap-2 text-sm font-light text-gray-700">
            <p className="flex gap-2">
              <input
                className="w-3"
                type="checkbox"
                value={"Floral"}
                onChange={toggleType}
              />{" "}
              Floral
            </p>
            <p className="flex gap-2">
              <input
                className="w-3"
                type="checkbox"
                value={"Oriental"}
                onChange={toggleType}
              />{" "}
              Oriental
            </p>
            <p className="flex gap-2">
              <input
                className="w-3"
                type="checkbox"
                value={"Woody"}
                onChange={toggleType}
              />{" "}
              Woody
            </p>
            <p className="flex gap-2">
              <input
                className="w-3"
                type="checkbox"
                value={"Leather"}
                onChange={toggleType}
              />{" "}
              Leather
            </p>
            <p className="flex gap-2">
              <input
                className="w-3"
                type="checkbox"
                value={"Fresh"}
                onChange={toggleType}
              />{" "}
              Fresh
            </p>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex-1">
        <div className="flex justify-between text-base sm:text-2xl mb-4">
          <Title text1={"ALL"} text2={"COLLECTIONS"} />

          {/* PRODUCT SORT */}
          <select
            onChange={(e) => setSortType(e.target.value)}
            className="border-2 border-gray-300 text-sm px-2"
          >
            <option value="relevant">Sort by: Relevant</option>
            <option value="low-high">Sort by: Low to High</option>
            <option value="high-low">Sort by: High to Low</option>
          </select>
        </div>

        {/* MAP PRODUCTS */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-6">
          {filterProducts.slice(0, visibleCount).map((item, i) => (
            <ProductItem
              key={i}
              id={item._id}
              image={item.image}
              name={item.name}
              price={item.price}
              quantity={item.quantity}
            />
          ))}
        </div>

        {/* BUTTON VEZI MAI MULTE */}
        {visibleCount < filterProducts.length && (
          <div className="flex justify-center mt-6">
            <button
              onClick={() => setVisibleCount((prev) => prev + 12)}
              className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
            >
              Show more
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Collection;