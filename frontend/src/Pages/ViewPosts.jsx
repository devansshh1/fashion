import { useContext, useEffect, useMemo, useState } from "react";
import { useOutletContext, useParams } from "react-router-dom";
import PostCard from "../components/PostCard";
import API from "../api/API";
import { AuthContext } from "../context/AuthContext";
import { authSession } from "../auth/sessionStorage";
import { POST_CATEGORIES } from "../constants/postCategories";

const EMPTY_POST_MANAGER = {
  canManage: false,
  isDeleteMode: false,
  onEnterDeleteMode: null,
  onExitDeleteMode: null,
};

function ViewPosts() {
  const { user } = useContext(AuthContext);
  const { setPostManager } = useOutletContext();
  const { category: routeCategory } = useParams();
  const normalizedRouteCategory =
    !routeCategory || routeCategory.toLowerCase() === "all" ? "" : routeCategory;

  const [posts, setPosts] = useState([]);
  const [category, setCategory] = useState(normalizedRouteCategory);
  const [currentActor, setCurrentActor] = useState(null);
  const [isDeleteMode, setIsDeleteMode] = useState(false);
  const [selectedPostIds, setSelectedPostIds] = useState([]);
  const [deleteError, setDeleteError] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    setCategory(normalizedRouteCategory);
    setIsDeleteMode(false);
    setSelectedPostIds([]);
    setDeleteError("");
  }, [normalizedRouteCategory]);

  useEffect(() => {
    let isMounted = true;

    const resolveCurrentActor = async () => {
      if (user?._id) {
        if (isMounted) {
          setCurrentActor({ role: "user", id: String(user._id) });
        }
        return;
      }

      const hasPartnerSession = Boolean(
        authSession.getPartnerToken() ||
        localStorage.getItem("partnerToken") ||
        localStorage.getItem("isPartnerLoggedIn") === "true"
      );

      if (!hasPartnerSession) {
        if (isMounted) {
          setCurrentActor(null);
        }
        return;
      }

      try {
        const res = await API.get("/api/partner/check-auth");

        if (!isMounted) {
          return;
        }

        if (res.data?.loggedIn && res.data?.partner?.id) {
          setCurrentActor({ role: "partner", id: String(res.data.partner.id) });
          return;
        }
      } catch (err) {
      }

      if (isMounted) {
        setCurrentActor(null);
      }
    };

    resolveCurrentActor();

    return () => {
      isMounted = false;
    };
  }, [user?._id]);

  const fetchPosts = async () => {
    const resp = await API.get(`/api/posts?category=${category}`);
    setPosts(resp.data.posts || []);
  };

  useEffect(() => {
    fetchPosts();
  }, [category]);

  const isOwnedByCurrentActor = (post) => {
    if (!currentActor?.id) {
      return false;
    }

    const ownerId =
      currentActor.role === "user"
        ? post.userId?._id || post.userId
        : post.partnerId?._id || post.partnerId;

    return ownerId ? String(ownerId) === String(currentActor.id) : false;
  };

  const ownedPosts = useMemo(
    () => posts.filter((post) => isOwnedByCurrentActor(post)),
    [posts, currentActor]
  );

  useEffect(() => {
    const ownedPostIdSet = new Set(ownedPosts.map((post) => post._id));

    setSelectedPostIds((prev) => prev.filter((id) => ownedPostIdSet.has(id)));

    if (!ownedPosts.length) {
      setIsDeleteMode(false);
      setDeleteError("");
    }
  }, [ownedPosts]);

  useEffect(() => {
    setPostManager({
      canManage: ownedPosts.length > 0,
      isDeleteMode,
      onEnterDeleteMode:
        ownedPosts.length > 0
          ? () => {
              setIsDeleteMode(true);
              setDeleteError("");
            }
          : null,
      onExitDeleteMode: () => {
        setIsDeleteMode(false);
        setSelectedPostIds([]);
        setDeleteError("");
      },
    });
  }, [ownedPosts.length, isDeleteMode, setPostManager]);

  useEffect(() => {
    return () => {
      setPostManager(EMPTY_POST_MANAGER);
    };
  }, [setPostManager]);

  const togglePostSelection = (postId) => {
    setSelectedPostIds((prev) =>
      prev.includes(postId)
        ? prev.filter((id) => id !== postId)
        : [...prev, postId]
    );
    setDeleteError("");
  };

  const toggleSelectAllOwnedPosts = () => {
    if (selectedPostIds.length === ownedPosts.length && ownedPosts.length > 0) {
      setSelectedPostIds([]);
      return;
    }

    setSelectedPostIds(ownedPosts.map((post) => post._id));
    setDeleteError("");
  };

  const handleDeleteSelectedPosts = async () => {
    if (!selectedPostIds.length) {
      setDeleteError("Select at least one post to delete.");
      return;
    }

    const shouldDelete = window.confirm(
      `Delete ${selectedPostIds.length} post${selectedPostIds.length > 1 ? "s" : ""}? This cannot be undone.`
    );

    if (!shouldDelete) {
      return;
    }

    try {
      setIsDeleting(true);
      setDeleteError("");

      const res = await API.delete("/api/posts/bulk-delete", {
        data: { postIds: selectedPostIds },
      });

      const deletedIdSet = new Set(res.data?.deletedIds || selectedPostIds);
      setPosts((prev) => prev.filter((post) => !deletedIdSet.has(post._id)));
      setSelectedPostIds([]);
      setIsDeleteMode(false);
    } catch (err) {
      const status = err.response?.status;
      const message = err.response?.data?.message;

      if (status === 404 && message) {
        setDeleteError(message);
      } else if (status === 404) {
        setDeleteError("Bulk delete is not available on the server yet. Redeploy the backend and try again.");
      } else if (status === 401) {
        setDeleteError("Your session expired. Please log in again and retry.");
      } else {
        setDeleteError(message || "Unable to delete posts.");
      }
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="premium-page">

      <div className="premium-header">

        <div className="header-text">
          <h1 className="bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">All Posts</h1>
          <p>Explore looks from every category</p>
        </div>

        <div className="header-filter">
          <label className="bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">Choose Category</label>
          <select
            className="premium-select bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent"
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              setIsDeleteMode(false);
              setSelectedPostIds([]);
              setDeleteError("");
            }}
          >
            <option value="">All Categories</option>
            {POST_CATEGORIES.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
        </div>

      </div>

      {ownedPosts.length > 0 && isDeleteMode && (
        <div className="profile-selection-toolbar">
          <p className="profile-selection-copy">
            {selectedPostIds.length} selected
          </p>

          <div className="profile-selection-actions">
            <button
              type="button"
              className="profile-selection-btn"
              onClick={toggleSelectAllOwnedPosts}
            >
              {selectedPostIds.length === ownedPosts.length && ownedPosts.length > 0 ? "Clear" : "Select All"}
            </button>

            <button
              type="button"
              className="profile-selection-btn"
              onClick={() => {
                setIsDeleteMode(false);
                setSelectedPostIds([]);
                setDeleteError("");
              }}
              disabled={isDeleting}
            >
              Cancel
            </button>

            <button
              type="button"
              className="profile-selection-btn profile-selection-btn-danger"
              onClick={handleDeleteSelectedPosts}
              disabled={!selectedPostIds.length || isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete Selected"}
            </button>
          </div>

          {deleteError && <p className="profile-modal-error">{deleteError}</p>}
        </div>
      )}

      <div className="premium-grid">
        {posts.map((p) => {
          const canDeletePost = isOwnedByCurrentActor(p);

          return (
            <PostCard
              key={p._id}
              post={p}
              refresh={fetchPosts}
              isDeleteMode={isDeleteMode}
              canDeletePost={canDeletePost}
              isSelected={selectedPostIds.includes(p._id)}
              onToggleSelect={() => togglePostSelection(p._id)}
            />
          );
        })}
      </div>

    </div>
  );
}

export default ViewPosts;
