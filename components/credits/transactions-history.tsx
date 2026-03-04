"use client";

import { useState } from "react";
import useSWR from "swr";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  getTransactionIcon,
  getTransactionTypeName,
} from "@/actions/credits/constants";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import type { TransactionsData } from "@/actions/credits";

interface TransactionsHistoryProps {
  initialData: TransactionsData;
  userId: string;
}

// Fetcher para SWR
const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function TransactionsHistory({ initialData }: TransactionsHistoryProps) {
  const [page, setPage] = useState(1);
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [limit, setLimit] = useState<number>(10);

  // Construir URL de la API
  const apiUrl = `/api/credits/transactions?page=${page}&limit=${limit}${typeFilter !== "all" ? `&type=${typeFilter}` : ""}`;

  // SWR con datos iniciales - deduplicación automática
  const { data, isLoading } = useSWR<TransactionsData>(apiUrl, fetcher, {
    fallbackData: page === 1 && typeFilter === "all" ? initialData : undefined,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });

  const handlePreviousPage = () => {
    if (page > 1) setPage(page - 1);
  };

  const handleNextPage = () => {
    if (data && page < data.pagination.totalPages) setPage(page + 1);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Historial de Transacciones</CardTitle>
          <Select
            value={typeFilter}
            onValueChange={(value) => {
              setTypeFilter(value);
              setPage(1); // Reset a página 1 cuando cambia el filtro
            }}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Filtrar por tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              <SelectItem value="PURCHASE">Compras</SelectItem>
              <SelectItem value="CONSUMPTION">Consumos</SelectItem>
              <SelectItem value="BONUS">Bonificaciones</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Cargando transacciones...</p>
          </div>
        ) : !data || data.transactions.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">
              No hay transacciones para mostrar
            </p>
          </div>
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Descripción</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead className="text-right">Cantidad</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.transactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="text-xl">
                          {getTransactionIcon(transaction.type)}
                        </span>
                        <span className="text-sm">
                          {getTransactionTypeName(transaction.type)}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">
                        {transaction.description || "-"}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-muted-foreground">
                        {format(new Date(transaction.createdAt), "PPp", {
                          locale: es,
                        })}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <span
                        className={`font-semibold ${
                          transaction.amount > 0
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {transaction.amount > 0 ? "+" : ""}
                        {transaction.amount}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {/* Paginación */}
            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center gap-2">
                <p className="text-sm text-muted-foreground">
                  Mostrando {(page - 1) * limit + 1} -{" "}
                  {Math.min(page * limit, data.pagination.total)} de{" "}
                  {data.pagination.total} transacciones
                </p>
                <Select
                  value={limit.toString()}
                  onValueChange={(value) => {
                    setLimit(Number(value));
                    setPage(1); // Reset a página 1 cuando cambia el límite
                  }}
                >
                  <SelectTrigger className="w-[100px]">
                    <SelectValue placeholder="Límite" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="20">20</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                    <SelectItem value="100">100</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePreviousPage}
                  disabled={page === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Anterior
                </Button>
                <span className="text-sm">
                  Página {page} de {data.pagination.totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleNextPage}
                  disabled={page >= data.pagination.totalPages}
                >
                  Siguiente
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
