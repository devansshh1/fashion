import { useLayoutEffect } from "react";
import { NavLink, Outlet, useLocation, useParams } from "react-router-dom";
import { HeroHighlight } from "@/components/ui/HeroHighlight";
import { BackgroundGradient } from "@/components/ui/background-gradient";
function CategoryPage() {
  const { category } = useParams();
  const location = useLocation();

  useLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [location.pathname]);

  return (
    <HeroHighlight>
    <div className="category-wrapper">

      <div className="category-nav">
        <BackgroundGradient>
           <NavLink to={`/category/${category}/top`} id="top-nav" className=" nav-item" >
          Top 5
        </NavLink>

        </BackgroundGradient>
       
<BackgroundGradient>
          <NavLink to={`/category/${category}/saved`} className="nav-item">
          Saved
        </NavLink>

</BackgroundGradient>


<BackgroundGradient>
   <NavLink to={`/category/${category}/upload`} className="nav-item plus-btn">
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
