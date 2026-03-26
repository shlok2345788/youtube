import React from 'react'
import { useState } from "react";
import { Button } from "@/components/ui/button";

const CategoryTabs = () => {
    const categories = [
        "All",
        "Music",
        "Gaming",
        "Live",
        "Mixes",
        "Computers",
        "Programming",
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
        <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm py-3 -mx-4 px-4 mb-2 overflow-hidden">
            <div className="flex gap-3 overflow-x-auto no-scrollbar scroll-smooth">
                {categories.map((category) => (
                    <Button 
                        key={category}
                        variant={activeCategory === category ? 'default' : 'secondary'}
                        onClick={() => setactiveCategory(category)}
                        className={`whitespace-nowrap rounded-lg px-3 py-1 text-sm font-medium transition-colors
                            ${activeCategory === category 
                                ? 'bg-foreground text-background hover:bg-foreground/90' 
                                : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'} border-none shadow-none`}
                    >
                        {category}
                    </Button>
                ))}
            </div>
        </div>
    )
}

export default CategoryTabs;