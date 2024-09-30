import React, { useEffect, useState } from "react";
import ApexCharts from "apexcharts";
import { TOTAL_FILE_SIZE, VISIT } from "../../../constants/api_constant";
import fetcher from "../../../fetcher";

const Main = () => {
  const [fileSize, setFileSize] = useState([]);

  const [visitCount, setVisitCount] = useState([]);

  const loadPage = async () => {
    try {
      const [responseFile, responseVisit] = await Promise.all([
        fetcher.get(TOTAL_FILE_SIZE),
        fetcher.get(VISIT),
      ]);
      setFileSize(responseFile.data);

      setVisitCount(responseVisit.data);
      console.log("responseVisit", responseVisit);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    loadPage();
  }, []);

  const optionsVisit = {
    colors: ["#00cadc"],
    series: [
      {
        name: "방문자 수",
        color: "#00cadc",
        data: visitCount,
      },
    ],
    chart: {
      type: "bar",
      height: "320px",
      fontFamily: "Inter, sans-serif",
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "70%",
        borderRadiusApplication: "end",
        borderRadius: 8,
      },
    },
    tooltip: {
      shared: true,
      intersect: false,
      style: {
        fontFamily: "Inter, sans-serif",
      },
    },
    states: {
      hover: {
        filter: {
          type: "darken",
          value: 1,
        },
      },
    },
    stroke: {
      show: true,
      width: 0,
      colors: ["transparent"],
    },
    grid: {
      show: false,
      strokeDashArray: 4,
      padding: {
        left: 2,
        right: 2,
        top: -14,
      },
    },
    dataLabels: {
      enabled: false,
    },
    legend: {
      show: false,
    },
    xaxis: {
      floating: false,
      labels: {
        show: true,
        style: {
          fontFamily: "Inter, sans-serif",
          cssClass: "text-xs font-normal fill-gray-500 dark:fill-gray-400",
        },
      },
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    yaxis: {
      show: false,
    },
    fill: {
      opacity: 1,
    },
  };

  const optionsImage = {
    series: [
      {
        name: "이미지 총 용량",
        color: "#ffe69c",
        data: fileSize.totalImageSize ? [fileSize.totalImageSize * 0.001] : [0],
      },
    ],
    chart: {
      sparkline: {
        enabled: false,
      },
      type: "bar",
      width: "100%",
      height: 150,
      toolbar: {
        show: false,
      },
    },
    fill: {
      opacity: 1,
    },
    plotOptions: {
      bar: {
        horizontal: true,
        columnWidth: "100%",
        borderRadiusApplication: "end",
        borderRadius: 6,
        dataLabels: {
          position: "top",
        },
      },
    },
    legend: {
      show: true,
      position: "bottom",
    },
    dataLabels: {
      enabled: false,
    },
    tooltip: {
      shared: true,
      intersect: false,
      formatter: function (value) {
        return value;
      },
    },
    xaxis: {
      labels: {
        show: true,
        style: {
          fontFamily: "Inter, sans-serif",
          cssClass: "text-xs font-normal fill-gray-500 dark:fill-gray-400",
        },
        formatter: function (value) {
          return value;
        },
      },
      categories: ["이미지(MB)"],
      axisTicks: {
        show: false,
      },
      axisBorder: {
        show: false,
      },
    },
    yaxis: {
      labels: {
        show: true,
        style: {
          fontFamily: "Inter, sans-serif",
          cssClass: "text-xs font-normal fill-gray-500 dark:fill-gray-400",
        },
      },
    },
    grid: {
      show: true,
      strokeDashArray: 4,
      padding: {
        left: 2,
        right: 2,
        top: -20,
      },
    },
  };

  const optionsVideo = {
    series: [
      {
        name: "영상 총 용량",
        color: "#fe6500",
        data: fileSize.totalVideoSize ? [fileSize.totalVideoSize * 0.001] : [0],
      },
    ],
    chart: {
      sparkline: {
        enabled: false,
      },
      type: "bar",
      width: "100%",
      height: 150,
      toolbar: {
        show: false,
      },
    },
    fill: {
      opacity: 1,
    },
    plotOptions: {
      bar: {
        horizontal: true,
        columnWidth: "100%",
        borderRadiusApplication: "end",
        borderRadius: 6,
        dataLabels: {
          position: "top",
        },
      },
    },
    legend: {
      show: true,
      position: "bottom",
    },
    dataLabels: {
      enabled: false,
    },
    tooltip: {
      shared: true,
      intersect: false,
      formatter: function (value) {
        return value;
      },
    },
    xaxis: {
      labels: {
        show: true,
        style: {
          fontFamily: "Inter, sans-serif",
          cssClass: "text-xs font-normal fill-gray-500 dark:fill-gray-400",
        },
        formatter: function (value) {
          return value;
        },
      },
      categories: ["영상(MB)"],
      axisTicks: {
        show: false,
      },
      axisBorder: {
        show: false,
      },
    },
    yaxis: {
      labels: {
        show: true,
        style: {
          fontFamily: "Inter, sans-serif",
          cssClass: "text-xs font-normal fill-gray-500 dark:fill-gray-400",
        },
      },
    },
    grid: {
      show: true,
      strokeDashArray: 4,
      padding: {
        left: 2,
        right: 2,
        top: -20,
      },
    },
  };

  useEffect(() => {
    if (fileSize) {
      if (
        document.getElementById("image-chart") &&
        typeof ApexCharts !== "undefined"
      ) {
        const chart = new ApexCharts(
          document.getElementById("image-chart"),
          optionsImage
        );
        chart.render();
      }

      if (
        document.getElementById("video-chart") &&
        typeof ApexCharts !== "undefined"
      ) {
        const chart = new ApexCharts(
          document.getElementById("video-chart"),
          optionsVideo
        );
        chart.render();
      }
    }

    if (visitCount) {
      if (
        document.getElementById("bar-chart") &&
        typeof ApexCharts !== "undefined"
      ) {
        const chart = new ApexCharts(
          document.getElementById("bar-chart"),
          optionsVisit
        );
        chart.render();
      }
    }
  }, [fileSize, visitCount]);
  return (
    <div className="flex rounded-lg border-2 border-[#fcc310] p-10 w-auto h-4/6">
      <div class=" w-auto bg-white rounded-lg shadow dark:bg-gray-800 p-4 md:p-6">
        <div class="text-3xl font-bold text-gray-900 dark:text-white text-center">
          이미지 및 영상 사용량
        </div>
        <div id="image-chart"></div>
        <div id="video-chart"></div>
      </div>
      <div class=" w-auto bg-white rounded-lg shadow dark:bg-gray-800 p-4 md:p-6">
        <div class="text-3xl font-bold text-gray-900 dark:text-white text-center">
          방문자 통계
        </div>
        <div id="bar-chart"></div>
      </div>
    </div>
  );
};

export default Main;
