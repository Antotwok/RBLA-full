import React from 'react';
import { useNavigate } from 'react-router-dom';
import './AboutPage.css';

import artisanImage from "../components/Assets/v6.png";
import varlogo from "../components/Assets/varlogo.png";
import vaalogo from "../components/Assets/vaalogo.png";
import sirlogo from "../components/Assets/sirlogo.png";

const AboutPage = () => {
  const navigate = useNavigate();

  const handleUnitClick = (unit) => {
    navigate(`/${unit.toLowerCase()}`);
  };

  const units = [
    { name: "Varnam", text_color: "#80002f", font_style: "italic", logo: varlogo },
    { name: "Vaagai", text_color: "#80002f", font_style: "italic", logo: vaalogo },
    { name: "Siragugal", text_color: "#80002f", font_style: "italic", logo: sirlogo }
];




  return (
    <div className="about-container">
      <div className="about-content">

        {/* Hero Section */}
        <div className="hero-section">
          <div className="heading">
            <h1>
              A social enterprise An authentic platform for pure craft.
            </h1>
          </div>
          <div className="content">
            <p>
              The India Craft House is a digital platform for some of the world's oldest
              and most intricate craft forms. We started this social enterprise close to
              10 years ago in order to preserve, showcase and share the talent of
              India's artisans with the world. We hope to be able to raise the dignity
              of the Indian artisan in our own way and kindle an interest and support
              for an unsurpassed legacy of craft that spans millennia and spreads
              across the length and breadth of the land. It is our effort to curate an
              undeniably unique selection of traditional art and craft translated into a
              range of beautiful, contemporary products.
            </p>
          </div>
        </div>

        {/* Artisan Section */}
        <div className="section artisan-section">
          <div className="heading">
            <h3>Established in 2010, Gurgaon, India.</h3>
          </div>
          <div className="content"><center>
            <p>
              We are headquartered in Gurgaon, India near the capital city of
              New Delhi. Our objective has always been to empower our
              artisans to deliver sustainable products of the finest quality. We
              devote ourselves to these causes. Each of our products are
              handcrafted and unique. Each product tells the unique story of
              the artisan who made it.
            </p></center>
            <div className="artisan-image">
              <img src={artisanImage} alt="Artisan crafting" />
            </div>
          </div>
        </div>
        <div className="units-section p-6 bg-gray-100 dark:bg-gray-800">
    <h2 className="text-3xl font-bold text-center text-red-500 mb-6">Our Units</h2>
    <div className="units-grid grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {units.map((unit) => (
            <div
                key={unit.name}
                className="unit-card flex flex-col items-center p-4 border-2 border-yellow-400 rounded-2xl shadow-lg cursor-pointer hover:bg-yellow-100 dark:hover:bg-yellow-700 transition-all duration-300"
                onClick={() => handleUnitClick(unit.name)}
                role="button"
                tabIndex={0}
                onKeyPress={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                        handleUnitClick(unit.name);
                    }
                }}
                aria-label={`Visit ${unit.name} page`}
            >
                <img 
                    src={unit.logo} 
                    alt={`${unit.name} Logo`} 
                    className="w-16 h-16 mb-2"
                />
                <p 
    className="text-xl transition-all duration-300"
    style={{ 
        color: unit.text_color, 
        fontStyle: unit.font_style === "italic" ? "italic" : "normal",
        fontWeight: unit.font_style === "bold" ? "bold" : "normal"
    }}
>
    {unit.name}
</p>
            </div>
        ))}
    </div>
</div>

      </div>
    </div>
  );
};

export default AboutPage;
