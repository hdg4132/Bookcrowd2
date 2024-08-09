import React, { useState, useEffect } from "react";
import axios from "axios"; // axios를 사용하여 데이터를 가져옵니다.
import { Link } from "react-router-dom";
import SubBanner from "../../component/SubBanner";
import "./CommunityList.css";

const parseDate = (dateString) => {
  const parsedDate = new Date(dateString);

  // 날짜가 유효한지 확인
  if (isNaN(parsedDate.getTime())) {
    console.error("잘못된 날짜 형식:", dateString);
    return null;
  }

  return parsedDate;
};

const formatDate = (dateString) => {
  const postDate = parseDate(dateString);

  if (!postDate) return "날짜 없음";

  const now = new Date();
  const diff = Math.abs(now - postDate);
  const diffMinutes = Math.floor(diff / 60000);

  if (diffMinutes < 1) return "방금 전";
  if (diffMinutes < 60) return `${diffMinutes}분 전`;

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours}시간 전`;

  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 30) return `${diffDays}일 전`;

  return postDate.toLocaleDateString();
};

export default function CommunityList() {
  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const [posts, setPosts] = useState([]);
  const [totalPages, setTotalPages] = useState(1); // 총 페이지 수 상태 추가
  const [loading, setLoading] = useState(true); // 로딩 상태 추가
  const [error, setError] = useState(null); // 에러 상태 추가

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/community");
        setPosts(response.data);
        setTotalPages(Math.ceil(response.data.length / itemsPerPage));
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const currentItems = posts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <SubBanner
        page_name={"checkout"}
        title_en={"Community"}
        title_kr={"커뮤니티"}
        search
      />
      <div className="list_body">
        <div className="container_fix">
          <ul>
            <li className="list_header_top list_header">
              <span className="list_title">제목</span>
              <div className="list_info">
                <span className="title_writer">작성자</span>
                <span className="title_date">게시일</span>
              </div>
            </li>
            {currentItems.map((item) => (
              <li className="list_header" key={item.id}>
                <span className="list_content">
                  <Link to={`/community/${item.id}`}>{item.title}</Link>
                </span>
                <div className="list_info">
                  <span className="writer">{item.author || "작성자 없음"}</span>
                  <span className="date">{formatDate(item.date)}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className="community_pagination">
          <button
            onClick={prevPage}
            className="pagination_button arrow"
            disabled={currentPage === 1}
          >
            &laquo;
          </button>
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index + 1}
              onClick={() => handlePageChange(index + 1)}
              className={`pagination_button ${
                currentPage === index + 1 ? "active" : ""
              }`}
            >
              {index + 1}
            </button>
          ))}
          <button
            onClick={nextPage}
            className="pagination_button arrow"
            disabled={currentPage === totalPages}
          >
            &raquo;
          </button>
        </div>
        <div className="write_button_box container_fix">
          <Link to={`/communityEdit`} className="write_button">
            글쓰기
          </Link>
        </div>
      </div>
    </div>
  );
}