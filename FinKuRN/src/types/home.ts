/**
 * Home Screen Data Types
 *
 * Type definitions for HomeScreen data structures.
 * Used by service layer and components.
 */

/**
 * Today task item data
 */
export interface TodayItemData {
  id: string;
  title: string;
  dday: string;
  detailText: string;
  detailAmount?: string;
  description: string;
}

/**
 * User greeting data
 */
export interface GreetingData {
  userName: string;
  greetingMessage: string;
  motivationMessage: string;
}

/**
 * Savings account data
 */
export interface SavingsData {
  id: string;
  name: string;
  startDate: string;
  monthlyDeposit: number;
  currentAmount: number;
  targetAmount: number;
  chartData: number[];
}

/**
 * Spending category data
 */
export interface SpendingCategoryData {
  category: string;
  amount: number;
  percentage: number;
  color: string;
}

/**
 * Spending overview data
 */
export interface SpendingData {
  totalAmount: number;
  categories: SpendingCategoryData[];
}

/**
 * Complete HomeScreen data
 */
export interface HomeScreenData {
  greeting: GreetingData;
  todayItems: TodayItemData[];
  todayItemsCount: number;
  savingsFilters: string[];
  spendingFilters: string[];
  savings: SavingsData;
  spending: SpendingData;
}
