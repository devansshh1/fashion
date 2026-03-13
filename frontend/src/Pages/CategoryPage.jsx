import { NavLink, Outlet } from "react-router-dom";
import { HeroHighlight, Highlight } from "@/components/ui/HeroHighlight";
import { BackgroundGradient } from "@/components/ui/background-gradient";
function CategoryPage() {
  return (
    <HeroHighlight>
    <div className="category-wrapper">

      <div className="category-nav">
        <BackgroundGradient>
           <NavLink to="top" id="top-nav" className=" nav-item" >
          Top 5
        </NavLink>

        </BackgroundGradient>
       

       <BackgroundGradient>
         <NavLink to="view" className="nav-item">
          View
        </NavLink>

       </BackgroundGradient>
       
<BackgroundGradient>
          <NavLink to="saved" className="nav-item">
          Saved
        </NavLink>

</BackgroundGradient>


<BackgroundGradient>
   <NavLink to="upload" className="nav-item plus-btn">
          +
        </NavLink>
</BackgroundGradient>
       
      </div>

      <div className="category-content">
        <Outlet />
      </div>

    </div>
    </HeroHighlight>
  );
}

export default CategoryPage;