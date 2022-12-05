import React, { useState, useEffect, useRef } from "react";
import "./swipeObserver.css";

const SwipeObserver = () => {
  const KIND_NUMBER = 7;
  // const categoryContentClass = "c-category__content";
  const categoryItemClass = "c-category__item";
  const avtiveCategoryClass = "c-category__item--isActive";
  const contentClass = "l-container__content";
  const containerRef = useRef(null);
  //   const content1Ref = useRef(null);
  //   const content2Ref = useRef(null);
  //   const content3Ref = useRef(null);
  //   const content4Ref = useRef(null);
  //   const content5Ref = useRef(null);
  //   const content6Ref = useRef(null);
  //   const content7Ref = useRef(null);
  const [categoryIndex, setCategoryIndex] = useState(0);
  const contents = useRef([]);

  //   useEffect(() => {
  // const container = containerRef.current;
  // const getIndex = () => {
  //   const containerBound = container.getBoundingClientRect();
  //   const containerWidth = containerBound.width;
  //   const content1Bound = content1Ref.current.getBoundingClientRect();
  //   const content1Left = Math.abs(content1Bound.left);
  //   const index = Math.floor(content1Left / containerWidth);
  //   setCategoryIndex(index);
  // };
  // container.addEventListener("scroll", getIndex);
  // return () => container.removeEventListener("scroll", getIndex);
  //   }, []);

  useEffect(() => {
    console.log(containerRef.current);
    let options = {
      root: containerRef.current,
      rootMargin: "0px",
      threshold: 1.0,
    };

    let observer = new IntersectionObserver(callback, options);
    const targets = [];
    const targetElements = document.getElementsByClassName(
      "l-container__content"
    );
    for (let i = 0; i < targetElements.length; i++) {
      observer.observe(targetElements[i]);
      targets.push(targetElements[i]);
    }
    contents.current = targets;
  }, []);

  const callback = (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        console.log("entry", entry.target);
        const list = contents.current;
        const index = list.findIndex((content) => content === entry.target);

        console.log(index);
        setCategoryIndex(index);
      }
    });
  };

  useEffect(() => {
    const categories = document.getElementsByClassName(categoryItemClass);
    for (let i = 0; i < categories.length; i++) {
      if (i === categoryIndex) {
        categories[i].classList.add(avtiveCategoryClass);
        categories[i].scrollIntoView({
          // behavior: "smooth",
          inline: "nearest",
        });
      } else {
        categories[i].classList.remove(avtiveCategoryClass);
      }
    }
  }, [categoryIndex]);

  const handleClickCategory = (e) => {
    const target = e.target;
    const categories = document.getElementsByClassName(categoryItemClass);
    const contents = document.getElementsByClassName(contentClass);
    const index = [].indexOf.call(categories, target);
    setCategoryIndex(index);
    contents[index].scrollIntoView({
      inline: "center",
    });
  };
  const createCategory = () => {
    const categories = [];
    for (let i = 0; i < KIND_NUMBER; i++) {
      const className =
        i === 0
          ? categoryItemClass + " " + avtiveCategoryClass
          : categoryItemClass;
      categories.push(
        <ul key={i} className={className} onClick={handleClickCategory}>
          category{i + 1}
        </ul>
      );
    }
    return <li className="c-category">{categories}</li>;
  };

  const createProducts = (n) => {
    const result = [];
    for (let i = 0; i < n; i++) {
      result.push(<p key={i}>Product {i + 1}</p>);
    }
    return result;
  };

  return (
    <div className="l-swipeEffect">
      <div className="l-category">{createCategory()}</div>
      <div className="l-container" ref={containerRef}>
        <div
          className="l-container__content c-content1" /* ref={content1Ref} */
        >
          <div className="c-content1__child">{createProducts(5)}</div>
        </div>
        <div
          className="l-container__content c-content2" /* ref={content2Ref} */
        >
          <div className="c-content2__child">{createProducts(200)}</div>
        </div>
        <div
          className="l-container__content c-content3" /* ref={content3Ref} */
        >
          <div className="c-content3__child">{createProducts(500)}</div>
        </div>
        <div
          className="l-container__content c-content4" /* ref={content4Ref} */
        >
          <div className="c-content4__child">{createProducts(10)}</div>
        </div>
        <div
          className="l-container__content c-content5" /* ref={content5Ref} */
        >
          <div className="c-content5__child">{createProducts(76)}</div>
        </div>
        <div
          className="l-container__content c-content6" /* ref={content6Ref} */
        >
          <div className="c-content6__child">{createProducts(99)}</div>
        </div>
        <div
          className="l-container__content c-content7" /* ref={content7Ref} */
        >
          <div className="c-content7__child">{createProducts(300)}</div>
        </div>
      </div>
    </div>
  );
};

export default SwipeObserver;
