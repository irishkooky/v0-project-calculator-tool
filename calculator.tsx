"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { Calculator, Plus, Trash2 } from "lucide-react"

interface SaleAmount {
  id: string
  amount: number
}

export default function PriceCalculator() {
  // 売上額リストの管理（万円単位）
  const [saleAmounts, setSaleAmounts] = useState<SaleAmount[]>([{ id: "1", amount: 0 }])
  const [bFixedAmountInMan, setBFixedAmountInMan] = useState<number>(5)

  // 売上額の合計（円に変換）
  const totalBaseAmount = saleAmounts.reduce((sum, item) => sum + item.amount * 10000, 0)
  const bFixedAmount = bFixedAmountInMan * 10000

  // 税込金額の計算（10%）
  const getTaxIncluded = (amount: number) => amount * 1.1

  // 黒崎さんの取り分計算（5% + 固定額）
  const getBShare = (amount: number) => {
    const percentage = amount * 0.05
    return percentage + bFixedAmount
  }

  // 税込総額
  const totalWithTax = getTaxIncluded(totalBaseAmount)

  // 黒崎さんの取り分
  const bShare = getBShare(totalBaseAmount)

  // 石井さんへの入金額
  const cShare = totalWithTax - bShare

  // 金額のフォーマット
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("ja-JP", {
      style: "currency",
      currency: "JPY",
    }).format(amount)
  }

  // 売上額入力フィールドの追加
  const addSaleAmount = () => {
    setSaleAmounts([...saleAmounts, { id: crypto.randomUUID(), amount: 0 }])
  }

  // 売上額入力フィールドの削除
  const removeSaleAmount = (id: string) => {
    if (saleAmounts.length > 1) {
      setSaleAmounts(saleAmounts.filter((item) => item.id !== id))
    }
  }

  // 売上額の更新
  const updateSaleAmount = (id: string, amount: number) => {
    setSaleAmounts(saleAmounts.map((item) => (item.id === id ? { ...item, amount } : item)))
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <Card className="mx-auto max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-6 w-6" />
            計算ツール
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* 売上額入力リスト */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>税抜き売上額（万円）</Label>
              <Button onClick={addSaleAmount} variant="outline" size="sm" className="flex items-center gap-1">
                <Plus className="h-4 w-4" />
                追加
              </Button>
            </div>

            {saleAmounts.map((item, index) => (
              <div key={item.id} className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Input
                    type="number"
                    placeholder="例：100"
                    value={item.amount || ""}
                    onChange={(e) => updateSaleAmount(item.id, Number(e.target.value))}
                    className="pr-12"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">万円</span>
                </div>
                {saleAmounts.length > 1 && (
                  <Button
                    onClick={() => removeSaleAmount(item.id)}
                    variant="ghost"
                    size="icon"
                    className="text-gray-500 hover:text-red-500"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>

          {/* 黒崎さんの取り分調整 */}
          <div className="space-y-4">
            <Label>黒崎さんの取り分</Label>
            <div className="flex items-center gap-4">
              <Slider
                value={[bFixedAmountInMan]}
                onValueChange={(values) => setBFixedAmountInMan(values[0])}
                max={10}
                step={0.5}
                className="flex-1"
              />
              <div className="relative w-32">
                <Input
                  type="number"
                  value={bFixedAmountInMan}
                  onChange={(e) => setBFixedAmountInMan(Number(e.target.value))}
                  className="pr-12"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">万円</span>
              </div>
            </div>
          </div>

          {/* 計算結果表示 */}
          <div className="rounded-lg bg-gray-100 p-4 space-y-4">
            <div>
              <Label className="text-sm text-gray-600">税込売上額</Label>
              <div className="flex items-baseline gap-4">
                <p className="text-xl font-bold">{formatCurrency(totalWithTax)}</p>
                <div className="text-gray-500">
                  <span className="text-xs">税抜き：</span>
                  <span className="text-sm font-medium">{formatCurrency(totalBaseAmount)}</span>
                </div>
              </div>
            </div>

            <div>
              <Label className="text-sm text-gray-600">黒崎さんの取り分（5% + {bFixedAmountInMan}万円）</Label>
              <p className="text-xl font-bold text-blue-600">{formatCurrency(bShare)}</p>
            </div>

            <div>
              <Label className="text-sm text-gray-600">石井さんへの入金額</Label>
              <p className="text-2xl font-bold text-green-600">{formatCurrency(cShare)}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

