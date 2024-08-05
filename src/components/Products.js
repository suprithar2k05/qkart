import { Search, SentimentDissatisfied } from "@mui/icons-material";
import ProductCard from "./ProductCard";
import {
  CircularProgress,
  Grid,
  Button,
  InputAdornment,
  TextField,
} from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import { config } from "../App";
import Footer from "./Footer";
import Header from "./Header";
import Cart, { generateCartItemsFrom } from "./Cart";
import "./Products.css";

// Definition of Data Structures used
/**
 * @typedef {Object} Product - Data on product available to buy
 *
 * @property {string} name - The name or title of the product
 * @property {string} category - The category that the product belongs to
 * @property {number} cost - The price to buy the product
 * @property {number} rating - The aggregate rating of the product (integer out of five)
 * @property {string} image - Contains URL for the product image
 * @property {string} _id - Unique ID for the product
 */

let productsData = [];

const Products = () => {
  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [cartProducts, setCartProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchValue, setSearchValue] = useState("");
  const [debounceTimer, setDebounceTimer] = useState(null);
  const DEBOUNCE_TIMEOUT = 800;
  const { enqueueSnackbar } = useSnackbar();

  function renderMessage(message, variant) {
    enqueueSnackbar(message, {
      variant,
    });
  }

  // TODO: CRIO_TASK_MODULE_PRODUCTS - Fetch products data and store it
  /**
   * Make API call to get the products list and store it to display the products
   *
   * @returns { Array.<Product> }
   *      Array of objects with complete data on all available products
   *
   * API endpoint - "GET /products"
   *
   * Example for successful response from backend:
   * HTTP 200
   * [
   *      {
   *          "name": "iPhone XR",
   *          "category": "Phones",
   *          "cost": 100,
   *          "rating": 4,
   *          "image": "https://i.imgur.com/lulqWzW.jpg",
   *          "_id": "v4sLtEcMpzabRyfx"
   *      },
   *      {
   *          "name": "Basketball",
   *          "category": "Sports",
   *          "cost": 100,
   *          "rating": 5,
   *          "image": "https://i.imgur.com/lulqWzW.jpg",
   *          "_id": "upLK9JbQ4rMhTwt4"
   *      }
   * ]
   *
   * Example for failed response from backend:
   * HTTP 500
   * {
   *      "success": false,
   *      "message": "Something went wrong. Check the backend console for more details"
   * }
   */
  async function fetchCart() {
    setLoading(true);
    const url = `${config.endpoint}/cart`;
    try {
      const response = await axios.get(url, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      setCartItems(response.data);
      setLoading(false);
      return response;
    } catch (error) {
      setError("Error fetching products. Please try again later.");
      setLoading(false);
      return null;
    }
  }

  useEffect(() => {
    performAPICall();
    localStorage.getItem('token') && fetchCart();
  }, []);

  useEffect(() => {
    if(productsData.length > 0)
      generateCartItemsFrom(cartItems, productsData);
      setCartProducts(generateCartItemsFrom(cartItems, productsData));
  }, [cartItems]);

  const performAPICall = async () => {
    setLoading(true);
    const url = `${config.endpoint}/products`;

    try {
      const response = await axios.get(url);
      setProducts(response.data);
      if(response.data){
        productsData = response.data;
      }
      
      setLoading(false);
      return response;
    } catch (error) {
      setError("Error fetching products. Please try again later.");
      setLoading(false);
      return null;
    }
  };

  // TODO: CRIO_TASK_MODULE_PRODUCTS - Implement search logic
  /**
   * Definition for search handler
   * This is the function that is called on adding new search keys
   *
   * @param {string} text
   *    Text user types in the search bar. To filter the displayed products based on this text.
   *
   * @returns { Array.<Product> }
   *      Array of objects with complete data on filtered set of products
   *
   * API endpoint - "GET /products/search?value=<search-query>"
   *
   */
  const performSearch = async (text) => {
    const url = `${config.endpoint}/products/search?value=${text}`;
    try {
      const response = await axios.get(url);
      setProducts(response.data);
    } catch (error) {
      setProducts([]);
      return null;
    }
  };

  // TODO: CRIO_TASK_MODULE_PRODUCTS - Optimise API calls with debounce search implementation
  /**
   * Definition for debounce handler
   * With debounce, this is the function to be called whenever the user types text in the searchbar field
   *
   * @param {{ target: { value: string } }} event
   *    JS event object emitted from the search input field
   *
   * @param {NodeJS.Timeout} debounceTimeout
   *    Timer id set for the previous debounce call
   *
   */
  const debounceSearch = (event, debounceTimeout) => {
    const text = event.target.value;

    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }

    const newTimer = setTimeout(() => {
      performSearch(text);
    }, debounceTimeout);

    setDebounceTimer(newTimer);
  };

  function isItemInCart(productId, cartProducts) {
    return cartProducts && cartProducts.filter(product => product.productId === productId).length > 0;
  }

  async function updateCartItems(token, productId, qty) {
    // setLoading(true);
    const url = `${config.endpoint}/cart`;
    try {
      const response = await axios.post(url, {productId, qty},{
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'content-type': 'application/json'
        }
      });
      setCartItems(response.data);
      renderMessage("Item added!", "success");
      // setLoading(false);
      return response;
    } catch (error) {
      setError("Error fetching products. Please try again later.");
      // setLoading(false);
      return null;
    }
  }
  const handleAddToCart = (productId) => {
    if(!localStorage.getItem('token')) {
      return renderMessage('Login to add an item to the Cart', 'warning')
    }
    if(isItemInCart(productId, cartProducts)) {
      return renderMessage('Item already in cart. Use the cart sidebar to update quantity or remove item.', 'warning')
    }
    updateCartItems(localStorage.getItem("token"), productId, 1);
  }

  return (
    <div>
      <Header hasHiddenAuthButtons={false}>
        {/* TODO: CRIO_TASK_MODULE_PRODUCTS - Display search bar in the header for Products page */}
        <TextField
          className="search-desktop"
          size="small"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <Search color="primary" />
              </InputAdornment>
            ),
          }}
          placeholder="Search for items/categories"
          name="search"
          value={searchValue}
          onChange={(e) => {
            setSearchValue(e.target.value);
            debounceSearch(e, DEBOUNCE_TIMEOUT);
          }}
        />
      </Header>
      {/* Search view for mobiles */}
      <TextField
        className="search-mobile"
        size="small"
        fullWidth
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <Search color="primary" />
            </InputAdornment>
          ),
        }}
        placeholder="Search for items/categories"
        name="search"
      />
      <Grid container>
        <Grid item xs={12} md={8} className="product-grid">
          <Box className="hero">
            <p className="hero-heading">
              India’s <span className="hero-highlight">FASTEST DELIVERY</span>{" "}
              to your door step
            </p>
          </Box>
          {products.length > 0 && !loading && !error ? (
            <Grid container spacing={2} style={{ marginTop: "20px" }}>
              {products.map((product) => (
                <Grid item key={product._id} xs={6} md={3}>
                  <ProductCard product={product} handleAddToCart={handleAddToCart}/>
                </Grid>
              ))}
            </Grid>
          ) : (
            <div
              style={{
                position: "relative",
                width: "100%",
                textAlign: "center",
              }}
            >
              <SentimentDissatisfied size={24} thickness={4} />
              <p>No Products Found</p>
            </div>
          )}
        </Grid>
        <Grid item xs={12} md={4}>
          <Cart {...{updateCartItems, products: productsData, items: cartProducts}}/>
        </Grid>
        {loading && (
        <div
          style={{
            position: "relative",
            width: "100%",
            textAlign: "center",
          }}
        >
          <CircularProgress size={24} thickness={4} />
          <p>Loading Products</p>
        </div>
      )}
      {error && <p className="error-message">{error}</p>}
      </Grid>
      
      <Footer />
    </div>
  );
};

export default Products;
