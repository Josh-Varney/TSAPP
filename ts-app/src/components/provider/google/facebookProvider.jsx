import React from 'react';

const FacebookProvider = () => {
    return (

        // Will need to update this so it actually works at a later date
        <button
            className="m-1 mb-6 p-2 border bg-white square-full shadow-md transition-transform transform hover:scale-105 hover:bg-blue-500 hover:shadow-lg active:scale-95 focus:outline-none"
            >
            <img
                src={"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRVRrJaFK_3YuRy8uV8001N40XhKHOlCEYmrQ&usqp=CAU"}
                alt="Google Logo"
                className="w-12 h-10 opacity-100"
            />
        </button>
      );
};


export default FacebookProvider;