"use client";

import { useEffect, useState } from "react";
import { Card, Row, Col, Statistic, Button } from "antd";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line, Bar, Pie } from "react-chartjs-2";
import { getProfiles, getBills, getBillInstances } from "@/utils/supabaseUtils";
import { getCurrentUser } from "@/utils/authUtils";
import { useTranslations } from "next-intl";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

export default function Dashboard() {
  const [totalProfiles, setTotalProfiles] = useState(0);
  const [totalBills, setTotalBills] = useState(0);
  const [paidBills, setPaidBills] = useState(0);
  const [unpaidBills, setUnpaidBills] = useState(0);
  const [monthlyData, setMonthlyData] = useState<{
    labels: string[];
    amounts: number[];
  }>({ labels: [], amounts: [] });
  const [profileData, setProfileData] = useState<{
    labels: string[];
    bills: number[];
  }>({ labels: [], bills: [] });
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const t = useTranslations("bills");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    if (await getCurrentUser()) {
      setIsLoggedIn(true);
    }

    try {
      const profiles = await getProfiles();
      const allBillsByProfile = await Promise.all(
        profiles.map((profile) => getBills(profile.id))
      );
      const billInstances = await getBillInstances();

      setTotalProfiles(profiles.length);

      const totalBills = allBillsByProfile.reduce(
        (sum, bills) => sum + bills.length,
        0
      );
      setTotalBills(totalBills);

      // Count paid and unpaid bills from instances
      const { paid, unpaid, monthlyAmounts } = billInstances.reduce(
        (acc, instance) => {
          if (instance.is_paid) {
            acc.paid++;
          } else {
            acc.unpaid++;
          }
          const month = new Date(instance.month).toLocaleString("default", {
            month: "long",
          });
          acc.monthlyAmounts[month] =
            (acc.monthlyAmounts[month] || 0) + instance.amount;
          return acc;
        },
        { paid: 0, unpaid: 0, monthlyAmounts: {} as Record<string, number> }
      );

      setPaidBills(paid);
      setUnpaidBills(unpaid);

      // Set monthly data
      setMonthlyData({
        labels: Object.keys(monthlyAmounts),
        amounts: Object.values(monthlyAmounts),
      });

      // Set profile data
      setProfileData({
        labels: profiles.map((p) => p.name),
        bills: allBillsByProfile.map((bills) => bills.length),
      });
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    }
  };

  const lineChartData = {
    labels: monthlyData.labels,
    datasets: [
      {
        label: "Monthly Expenses",
        data: monthlyData.amounts,
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
      },
    ],
  };

  const barChartData = {
    labels: profileData.labels,
    datasets: [
      {
        label: "Bills per Profile",
        data: profileData.bills,
        backgroundColor: "rgba(54, 162, 235, 0.5)",
      },
    ],
  };

  const pieChartData = {
    labels: ["Paid", "Unpaid"],
    datasets: [
      {
        data: [paidBills, unpaidBills],
        backgroundColor: ["rgba(75, 192, 192, 0.5)", "rgba(255, 99, 132, 0.5)"],
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
  };

  if (!isLoggedIn) {
    return (
      <>
        <div className="px-4 sm:px-0 min-h-[84vh] grid place-items-center">
          <div className="flex flex-col items-center justify-center gap-3">
            <p className="text-xl text-center">{t("not_logged_in")}</p>
            <Button type="primary" size="large" href="/login">
              {t("login")}
            </Button>
          </div>
        </div>
      </>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic title="Total Profiles" value={totalProfiles} />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic title="Total Bills" value={totalBills} />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic title="Paid Bills" value={paidBills} />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic title="Unpaid Bills" value={unpaidBills} />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card title="Monthly Expenses">
            <div className="h-[300px]">
              <Line data={lineChartData} options={chartOptions} />
            </div>
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="Bills per Profile">
            <div className="h-[300px]">
              <Bar data={barChartData} options={chartOptions} />
            </div>
          </Card>
        </Col>
        <Col xs={24}>
          <Card title="Bill Status Distribution">
            <div className="h-[300px]">
              <Pie data={pieChartData} options={chartOptions} />
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
