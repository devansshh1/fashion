import { useEffect, useLayoutEffect, useState } from "react";
import { NavLink, Outlet, useLocation, useParams } from "react-router-dom";
import { HeroHighlight } from "@/components/ui/HeroHighlight";
import { BackgroundGradient } from "@/components/ui/background-gradient";

const DEFAULT_POST_MANAGER = {
  canManage: false,
  isDeleteMode: false,
  onEnterDeleteMode: null,
  onExitDeleteMode: null,
};

function CategoryPage() {
  const { category } = useParams();
  const location = useLocation();
  const [postManager, setPostManager] = useState(DEFAULT_POST_MANAGER);
  const [showPostMenu, setShowPostMenu] = useState(false);

  useLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [location.pathname]);

  useLayoutEffect(() => {
    setPostManager(DEFAULT_POST_MANAGER);
    setShowPostMenu(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!showPostMenu) {
      return undefined;
    }

    const handleOutsideClick = () => setShowPostMenu(false);
    window.addEventListener("click", handleOutsideClick);

    return () => window.removeEventListener("click", handleOutsideClick);
  }, [showPostMenu]);

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

        {postManager.canManage && (
          <div className="category-post-menu-shell">
            <button
              type="button"
              className="category-post-menu-btn"
              onClick={(event) => {
                event.stopPropagation();
                setShowPostMenu((prev) => !prev);
              }}
              aria-label="Post actions"
            >
              ...
            </button>

            {showPostMenu && (
              <div
                className="category-post-menu-dropdown"
                onClick={(event) => event.stopPropagation()}
              >
                <button
                  type="button"
                  className="category-post-menu-item"
                  onClick={() => {
                    if (postManager.isDeleteMode) {
                      postManager.onExitDeleteMode?.();
                    } else {
                      postManager.onEnterDeleteMode?.();
                    }
                    setShowPostMenu(false);
                  }}
                >
                  {postManager.isDeleteMode ? "Cancel Delete" : "Delete Posts"}
                </button>
              </div>
            )}
          </div>
        )}
       
      </div>

      <div className="category-content">
        <Outlet context={{ setPostManager }} />
      </div>

    </div>
    </HeroHighlight>
  );
}

export default CategoryPage;
