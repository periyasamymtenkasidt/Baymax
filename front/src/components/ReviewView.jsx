import React from "react";

const reviews = [
  { id: 1, name: "Alice", rating: 5, comment: "Great help, very friendly!" },
  { id: 2, name: "Bob", rating: 4, comment: "Useful recommendations." },
  { id: 3, name: "Carol", rating: 5, comment: "Highly recommend Baymax!" },
];

const ReviewView = () => {
  return (
    <section className="bg-red-50 text-red-700 px-6 py-12 max-w-4xl mx-auto rounded-lg my-10 shadow-lg">
      <h2 className="text-3xl font-bold mb-6 text-center">User Reviews</h2>
      <div className="space-y-6">
        {reviews.map(({ id, name, rating, comment }) => (
          <div key={id} className="border border-red-300 rounded-lg p-4 bg-white shadow-sm">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-semibold text-lg">{name}</h3>
              <div className="flex space-x-1 text-yellow-400">
                {Array(rating).fill(0).map((_, i) => (
                  <svg key={i} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 fill-current" viewBox="0 0 20 20">
                    <path d="M10 15l-5.878 3.09 1.122-6.545L.488 6.91l6.572-.955L10 0l2.94 5.955 6.572.955-4.756 4.635 1.122 6.545z" />
                  </svg>
                ))}
              </div>
            </div>
            <p className="text-sm">{comment}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ReviewView;
