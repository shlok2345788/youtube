import React from 'react'
import { useState } from "react";
import { Button } from "@/components/ui/button";


const CategoryTabs = () => {
    const categories = [
        "All",
        "Music",
        "Gaming",
        "Movies",
        "News",
        "Sports",
        "Technology",
        "Comedy",
        "Education",
        "Science",
        "Travel",
        "Food",
        "Fashion",
    ]
    const [activeCategory, setactiveCategory] = useState('All');

    return (
        <div>
            {categories.map((category) => (
                <Button key={category}
                    variant={activeCategory === category ? 'default' : 'secondary'}
                    onClick={() => setactiveCategory(category)}
                    className=''>
                    {category}
                </Button>
            ))}
        </div>
    )
}

export default CategoryTabs