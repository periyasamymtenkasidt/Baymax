import React, { useEffect, useState } from "react";

// A simple component to display stars
const StarRating = ({ rating }) => {
  const fullStars = Math.floor(rating);
  const emptyStars = 5 - fullStars;
  return (
    <div className="flex items-center">
      {[...Array(fullStars)].map((_, i) => (
        <span key={i} className="text-yellow-500 text-lg">★</span>
      ))}
      {[...Array(emptyStars)].map((_, i) => (
        <span key={i} className="text-gray-300 text-lg">★</span>
      ))}
      <span className="ml-2 text-sm text-gray-700">{rating}/5</span>
    </div>
  );
};

const Testimonials = () => {
  const [feedbacks, setFeedbacks] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/review/getall") // replace with your actual URL
      .then(res => res.json())
      .then(data => {
        // Sort high to low rating
        const sorted = data.sort((a, b) => b.rating - a.rating);
        setFeedbacks(sorted);
      });
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left mt-8">
      {feedbacks.map((item) => (
        <div key={item._id} className="bg-red-100 p-6 rounded-xl">
          <p className="mb-4">"{item.comment}"</p>
          <StarRating rating={item.rating} />
        </div>
      ))}
    </div>
  );
};

export default Testimonials;
