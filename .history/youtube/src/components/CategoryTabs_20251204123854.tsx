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
            {categories.map(()=>{
                
            })}
        </div>
    )
}

export default CategoryTabs