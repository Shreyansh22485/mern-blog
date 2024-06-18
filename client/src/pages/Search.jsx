import { Button, Select, TextInput } from "flowbite-react";
import { set } from "mongoose";
import React, { useEffect } from "react";
import { AiOutlineSearch } from "react-icons/ai";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import PostCard from "../components/PostCard";

const Search = () => {
  const [sidebarData, setSidebarData] = React.useState({
    seachTerm: "",
    sort: "desc",
    category: "uncategorized",
  });
  const [posts, setPosts] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [showMore, setShowMore] = React.useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get("searchterm");
    const sortFromUrl = urlParams.get("sort");
    const categoryFromUrl = urlParams.get("category");
    if (searchTermFromUrl || sortFromUrl || categoryFromUrl) {
      setSidebarData({
        ...sidebarData,
        seachTerm: searchTermFromUrl,
        sort: sortFromUrl,
        category: categoryFromUrl,
      });
    }
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const searchQuery = urlParams.toString();
        const response = await fetch(`/api/post/getposts?${searchQuery}`);
        const data = await response.json();
        if (!response.ok) {
          setLoading(false);

          console.log(data.message);
          return;
        } else {
          setPosts(data.posts);
          setLoading(false);
          if (data.posts.length >= 9) {
            setShowMore(true);
          } else {
            setShowMore(false);
          }
        }
      } catch (error) {
        console.log(error);
      }
      setLoading(false);
    };
    fetchPosts();
  }, [location.search]);

  const handleChange = (e) => {
    if (e.target.id === "searchTerm") {
      setSidebarData({ ...sidebarData, seachTerm: e.target.value });
    }
    if (e.target.id === "sort") {
      const order = e.target.value || "desc";
      setSidebarData({ ...sidebarData, sort: order });
    }
    if (e.target.id === "category") {
      const category = e.target.value || "uncategorized";
      setSidebarData({ ...sidebarData, category: category });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(location.search);
    urlParams.set("searchterm", sidebarData.seachTerm);
    urlParams.set("sort", sidebarData.sort);
    urlParams.set("category", sidebarData.category);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

    const handleShowMore = async () => {
        const numberOfPosts = posts.length;
        const startIndex = numberOfPosts;
        const urlParams = new URLSearchParams(location.search);
        urlParams.set("startIndex", startIndex);
        const searchQuery = urlParams.toString();
        setLoading(true);
        try {
            const response = await fetch(`/api/post/getposts?${searchQuery}`);
            const data = await response.json();
            if (!response.ok) {
                setLoading(false);
                console.log(data.message);
                return;
            } else {
                setPosts([...posts, ...data.posts]);
                setLoading(false);
                if (data.posts.length >= 9) {
                    setShowMore(true);
                } else {
                    setShowMore(false);
                }
            }
        } catch (error) {
            console.log(error);
        }
    }

  return (
    <div className=" flex flex-col md:flex-row ">
      <div className="p-7 border-b md:border-r md:min-h-screen border-gray-500">
        <form className="flex flex-col gap-8" onSubmit={handleSubmit}>
          <div className="flex items-center gap-2">
            <label className=" whitespace-nowrap font-semibold">
              Search Term:
            </label>
            <TextInput
              id="searchTerm"
              type="text"
              placeholder="Search"
              rightIcon={AiOutlineSearch}
              value={sidebarData.seachTerm}
              onChange={handleChange}
            ></TextInput>
          </div>
          <div className="flex items-center gap-2">
            <label className="whitespace-nowrap font-semibold">Sort:</label>
            <Select onChange={handleChange} Value={sidebarData.sort} id="sort">
              <option value="desc">Latest</option>
              <option value="asc">Oldest</option>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <label className="whitespace-nowrap font-semibold">Category:</label>
            <Select
              onChange={handleChange}
              Value={sidebarData.category}
              id="category"
            >
              <option value="uncategorized">Uncategorized</option>
              <option value="technology">Technology</option>
              <option value="lifestyle">Lifestyle</option>
              <option value="programming">Coding</option>
              <option value="food">Food</option>
              <option value="travel">Travel</option>
              <option value="sports">Sports</option>
              <option value="music">Music</option>
            </Select>
          </div>
          <Button type="submit" outline gradientDuoTone={"purpleToPink"} pill>
            Apply Filters
          </Button>
        </form>
      </div>
      <div className="w-full">
        <h1 className="text-3xl font-semibold p-3 sm:border-b border-gray-500 mt-5">
          Search Results
        </h1>
        <div className="p-7 flex flex-wrap gap-4">
          {!loading && posts.length === 0 && (
            <h1 className="text-xl font-semibold text-gray-500">
              No Posts Found
            </h1>
          )}
          {loading && <h1 className="text-xl font-semibold">Loading...</h1>}
          {!loading &&
            posts &&
            posts.map((post) => 
              <PostCard key={post._id} post={post}></PostCard>
            )}
            {showMore && (
                <button className=" w-full p-3 bg-gray-200 dark:bg-slate-800 text-gray-900 dark:text-gray-100 font-semibold 
                hover:bg-gray-300 dark:hover:bg-slate-700 transition-colors duration-300 ease-in-out
                " onClick={handleShowMore}>
                  Show More
                </button>
                )

                }
        </div>
      </div>
    </div>
  );
};

export default Search;
