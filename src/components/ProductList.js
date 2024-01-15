import React, { useState, useEffect, useMemo } from "react";
import { useAuth } from "./AuthContext";
import { flattenProducts } from "../helpers";
import Header from "./Header";
import "./ProductList.css";
const ProductList = () => {
  const { loggedInUser } = useAuth();
  const [products, setProducts] = useState([]);
  const [nameInput, setNameInput] = useState("");
  const [priceInput, setPriceInput] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!loggedInUser || !loggedInUser.jwt) {
          console.error("User not authenticated. Please log in.");
          return;
        }

        const response = await fetch(
          "https://junior-test.mntzdevs.com/api/products/",
          {
            headers: {
              Authorization: `Bearer ${loggedInUser.jwt}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          const products = Object.values(data.products);
          setProducts(flattenProducts(products));
        } else {
          console.error("Error fetching products:", response.status);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchData();
  }, [loggedInUser]);

  const numericPriceInput = priceInput ? Number(priceInput) : null;

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesName = product.name
        .toLowerCase()
        .includes(nameInput.toLowerCase());
      const matchesPrice =
        numericPriceInput == null || product.price === numericPriceInput;
      return matchesName && matchesPrice;
    });
  }, [products, nameInput, numericPriceInput]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredProducts.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  return (
    <div>
      <Header />
      <div className="product-main">
        <h2>Product List</h2>

        <div>
          <div className="filter">
            <h4>Filter by name</h4>
            <input onChange={(e) => setNameInput(e.target.value)} />
          </div>
          <div className="filter">
            <h4>Filter by price</h4>
            <input onChange={(e) => setPriceInput(e.target.value)} />
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Price</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((product, index) => (
              <tr key={index}>
                <td>{product?.name}</td>
                <td>{product?.price}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div>
          <div>
            <h4>Items per page:</h4>
            <select
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(parseInt(e.target.value, 10));
                setCurrentPage(1);
              }}
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
            </select>
          </div>
          <div>
            <h4>Page:</h4>
            <select
              value={currentPage}
              onChange={(e) => setCurrentPage(parseInt(e.target.value, 10))}
            >
              {Array.from({ length: totalPages }, (_, index) => (
                <option key={index + 1} value={index + 1}>
                  {index + 1}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductList;
