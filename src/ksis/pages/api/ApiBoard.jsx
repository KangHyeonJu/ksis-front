import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { API_LIST, API_NOTICE } from "../../../constants/api_constant";
import fetcher from "../../../fetcher";
import ApiTable from "../../components/apiBoard/ApiTable";
import ApiSearchBar from "../../components/apiBoard/ApiSearchBar";
import ApiPagination from "../../components/apiBoard/ApiPagination";
import CreateButton from "../../components/apiBoard/CreateButton";
import DeleteButton from "../../components/apiBoard/DeleteButton";

const ApiBoard = () => {
  const [posts, setPosts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchCategory, setSearchCategory] = useState("apiName");
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedPosts, setSelectedPosts] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const postsPerPage = 5;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetcher.get(API_LIST);
        setPosts(response.data);
      } catch (err) {
        setError(err.message || "데이터를 가져오는 중 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const handleDeletePosts = async () => {
    if (selectedPosts.size === 0) {
      alert("삭제할 게시글을 선택해주세요.");
      return;
    }
    try {
      const deletePromises = [...selectedPosts].map((id) =>
        fetcher(API_NOTICE + `/${id}`, { method: "DELETE" })
      );
      await Promise.all(deletePromises);
      setPosts((prevPosts) =>
        prevPosts.filter((post) => !selectedPosts.has(post.apiId))
      );
      setSelectedPosts(new Set());
      alert("선택된 게시글이 삭제되었습니다.");
      navigate("/apiboard");
    } catch (err) {
      setError("게시글 삭제 중 오류가 발생했습니다.");
    }
  };

  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const value = post[searchCategory]?.toLowerCase() || "";
      return value.includes(searchTerm.toLowerCase());
    });
  }, [posts, searchTerm, searchCategory]);

  const paginatedPosts = useMemo(() => {
    const startIndex = currentPage * postsPerPage;
    return filteredPosts.slice(startIndex, startIndex + postsPerPage);
  }, [filteredPosts, currentPage]);

  const handlePageChange = (selectedPage) => {
    setCurrentPage(selectedPage.selected);
  };

  if (loading) {
    return <p>로딩 중...</p>;
  }

  if (error) {
    return <p>오류 발생: {error}</p>;
  }

  return (
    <div className="p-6">
      <h1 className="text-4xl font-bold">API 목록</h1>
      <ApiSearchBar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        searchCategory={searchCategory}
        setSearchCategory={setSearchCategory}
      />
      <div className="flex justify-end mb-4">
        <CreateButton />
        <DeleteButton handleDelete={handleDeletePosts} />
      </div>
      <ApiTable
        paginatedPosts={paginatedPosts}
        selectedPosts={selectedPosts}
        handleCheckboxChange={(id, e) =>
          setSelectedPosts((prev) =>
            e.target.checked ? new Set(prev).add(id) : new Set(prev).delete(id)
          )
        }
        handleSelectAllChange={(e) =>
          setSelectedPosts(
            e.target.checked
              ? new Set(paginatedPosts.map((post) => post.apiId))
              : new Set()
          )
        }
        isAllSelected={paginatedPosts.every((post) =>
          selectedPosts.has(post.apiId)
        )}
        handleApiNameClick={(apiId) => navigate(`/apiform/${apiId}`)}
        formatDate={(dateString) => (dateString ? dateString.substring(0, 10) : "")}
      />
      <ApiPagination
        pageCount={Math.ceil(filteredPosts.length / postsPerPage)}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default ApiBoard;
