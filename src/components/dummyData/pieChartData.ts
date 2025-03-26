import { AGRICULTURE, FORESTERY, HORTICULTURE } from "../utils/constants";

export interface pieChartDataProps {
value: number;
name: string;
};


export const pieChartData: pieChartDataProps[] = [
    { value: 800, name: AGRICULTURE },
    { value: 635, name: FORESTERY },
    { value: 580, name: HORTICULTURE }
]