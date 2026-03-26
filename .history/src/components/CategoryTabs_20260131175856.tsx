import React from 'react'
import { useState } from "react";
import { Button } from "@/components/ui/button";

import { Button } from "../ui/button";


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
        <div className="flex  gap-2 mb-6 overflow-x-auto pt-2">
            {categories.map((category) => (
                <Button key={category}
                    variant={activeCategory === category ? 'default' : 'secondary'}
                    onClick={() => setactiveCategory(category)}
                    className=' '>
                    {category}
                </Button>
            ))}
        </div>
    )
}

export default CategoryTabs