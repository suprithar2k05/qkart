import { AddShoppingCartOutlined } from "@mui/icons-material";
import StarIcon from "@mui/icons-material/Star";
import StarOutlineIcon from "@mui/icons-material/StarOutline";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Rating,
  Typography,
} from "@mui/material";
import React from "react";
import "./ProductCard.css";


const ProductCard = ({ product, handleAddToCart }) => {

  return (
    <Card className="card">
      <CardMedia
        component="img"
        height="100%"
        image={product.image}
        alt="Paella dish"
      />
      <CardContent>
        <Typography>{product.name}</Typography>
        <Typography gutterBottom component="div">
         ${product.cost}
        </Typography>
        <Rating
          name="text-feedback"
          value={product.rating}
          readOnly
          precision={0.5}
          icon={<StarIcon fontSize="inherit" />}
          emptyIcon={
            <StarOutlineIcon style={{ opacity: 0.55 }} fontSize="inherit" />
          }
        />
      </CardContent>
      <CardActions>
        <Button 
        fullWidth
        onClick={() => handleAddToCart(product._id)}
        startIcon={<AddShoppingCartOutlined />} 
        variant="contained">
          ADD TO CART
        </Button>
      </CardActions>
    </Card>
  );
};

export default ProductCard;
