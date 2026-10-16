import { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { 
  Plus, 
  Trash2, 
  Save, 
  Upload,
  X,
  Search,
  Check,
  FileSpreadsheet
} from 'lucide-react';
import { Badge } from '../ui/badge';
import { ScrollArea } from '../ui/scroll-area';
import { DataImportModal } from './DataImportModal';

interface Student {
  stanbuk: string; // Primary Key
  name: string;
  class: string;
  gender: 'L' | 'P';
  room: string;
  birthDate?: string;
  parentName?: string;
  parentPhone?: string;
}

interface DataTableInputProps {
  title: string;
  description: string;
  dataType?: 'attendance' | 'discipline' | 'achievement' | 'payment' | 'santri';
  columns: {
    key: string;
    label: string;
    type: 'text' | 'number' | 'date' | 'time' | 'select' | 'student-autocomplete';
    options?: string[];
    placeholder?: string;
  }[];
  onImport: (data: any[]) => void;
}

// Mock student data with Stanbuk as primary key
const mockStudents: Student[] = [
  { stanbuk: '2023001', name: 'Ahnaf Haidar', class: '2 Wusta', gender: 'L', room: 'Kamar 1A', birthDate: '2008-05-15', parentName: 'Ahmad Suryanto', parentPhone: '081234567890' },
  { stanbuk: '2023002', name: 'Azmi Syahid', class: '1 Ulya', gender: 'L', room: 'Kamar 2B', birthDate: '2007-08-20', parentName: 'Muhammad Ridwan', parentPhone: '081234567891' },
  { stanbuk: '2023003', name: 'Raihan Firdaus', class: '3 Ula', gender: 'L', room: 'Kamar 1B', birthDate: '2009-03-10', parentName: 'Abdul Rahman', parentPhone: '081234567892' },
  { stanbuk: '2023004', name: 'Ahmad Habib', class: '2 Wusta', gender: 'L', room: 'Kamar 3A', birthDate: '2008-11-25', parentName: 'Habibullah Hasan', parentPhone: '081234567893' },
  { stanbuk: '2023005', name: 'Fadil Akbar', class: '1 Ulya', gender: 'L', room: 'Kamar 2C', birthDate: '2007-06-18', parentName: 'Akbar Maulana', parentPhone: '081234567894' },
  { stanbuk: '2023006', name: 'Zahra Aisyah', class: '2 Wusta', gender: 'P', room: 'Kamar 1D', birthDate: '2008-09-12', parentName: 'Siti Nurhaliza', parentPhone: '081234567895' },
  { stanbuk: '2023007', name: 'Nadhifa Humaira', class: '3 Ula', gender: 'P', room: 'Kamar 2E', birthDate: '2009-01-30', parentName: 'Humaira Dewi', parentPhone: '081234567896' },
  { stanbuk: '2023008', name: 'Qonita Azizah', class: '1 Ulya', gender: 'P', room: 'Kamar 3B', birthDate: '2007-04-22', parentName: 'Azizah Rahman', parentPhone: '081234567897' },
  { stanbuk: '2023009', name: 'Rafif Ibrahim', class: '2 Wusta', gender: 'L', room: 'Kamar 1C', birthDate: '2008-07-08', parentName: 'Ibrahim Khalil', parentPhone: '081234567898' },
  { stanbuk: '2023010', name: 'Syafiq Maulana', class: '3 Ula', gender: 'L', room: 'Kamar 2A', birthDate: '2009-02-14', parentName: 'Maulana Yusuf', parentPhone: '081234567899' },
  { stanbuk: '2023011', name: 'Haikal Zaydan', class: '1 Ulya', gender: 'L', room: 'Kamar 1A', birthDate: '2007-10-05', parentName: 'Zaydan Fauzi', parentPhone: '081234567800' },
  { stanbuk: '2023012', name: 'Khansa Aliyah', class: '2 Wusta', gender: 'P', room: 'Kamar 2D', birthDate: '2008-12-20', parentName: 'Aliyah Safitri', parentPhone: '081234567801' },
];

export function DataTableInput({ title, description, dataType = 'santri', columns, onImport }: DataTableInputProps) {
  const [rows, setRows] = useState<any[]>([]);
  const [showAutocomplete, setShowAutocomplete] = useState<{ rowIndex: number; columnKey: string } | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [showImportModal, setShowImportModal] = useState(false);

  useEffect(() => {
    if (searchTerm) {
      const filtered = mockStudents.filter(student =>
        student.stanbuk.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredStudents(filtered);
    } else {
      setFilteredStudents([]);
    }
  }, [searchTerm]);

  const addRow = () => {
    const newRow: any = { id: Date.now().toString() };
    columns.forEach(col => {
      newRow[col.key] = '';
    });
    setRows([...rows, newRow]);
  };

  const deleteRow = (index: number) => {
    setRows(rows.filter((_, i) => i !== index));
  };

  const updateCell = (rowIndex: number, columnKey: string, value: any) => {
    const newRows = [...rows];
    newRows[rowIndex][columnKey] = value;
    setRows(newRows);
  };

  const selectStudent = (rowIndex: number, student: Student) => {
    const newRows = [...rows];
    
    // Auto-fill student data based on Stanbuk (Primary Key)
    newRows[rowIndex]['stanbuk'] = student.stanbuk;
    newRows[rowIndex]['santri_name'] = student.name;
    
    // Auto-fill additional fields if they exist in column definition
    if (columns.some(col => col.key === 'class')) {
      newRows[rowIndex]['class'] = student.class;
    }
    if (columns.some(col => col.key === 'gender')) {
      newRows[rowIndex]['gender'] = student.gender === 'L' ? 'Laki-laki' : 'Perempuan';
    }
    if (columns.some(col => col.key === 'room')) {
      newRows[rowIndex]['room'] = student.room;
    }
    if (columns.some(col => col.key === 'birth_date')) {
      newRows[rowIndex]['birth_date'] = student.birthDate || '';
    }
    if (columns.some(col => col.key === 'parent_name')) {
      newRows[rowIndex]['parent_name'] = student.parentName || '';
    }
    if (columns.some(col => col.key === 'parent_phone')) {
      newRows[rowIndex]['parent_phone'] = student.parentPhone || '';
    }
    
    setRows(newRows);
    setShowAutocomplete(null);
    setSearchTerm('');
  };

  const handleImport = () => {
    if (rows.length === 0) {
      alert('Tidak ada data untuk diimpor');
      return;
    }

    // Validate that all required fields are filled
    const emptyFields = rows.some(row => 
      columns.some(col => !row[col.key] || row[col.key] === '')
    );

    if (emptyFields) {
      const confirm = window.confirm(
        'Beberapa field masih kosong. Apakah Anda yakin ingin mengimpor data ini?'
      );
      if (!confirm) return;
    }

    onImport(rows);
    setRows([]);
    alert(`Berhasil mengimpor ${rows.length} data ke database`);
  };

  const handleImportFromModal = (importedData: any[]) => {
    // Add imported data to rows
    const newRows = importedData.map(data => ({
      id: Date.now().toString() + Math.random(),
      ...data
    }));
    setRows([...rows, ...newRows]);
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <CardTitle>{title}</CardTitle>
              <CardDescription>{description}</CardDescription>
            </div>
            <div className="flex gap-2 flex-wrap">
              <Button 
                onClick={() => setShowImportModal(true)} 
                variant="outline" 
                size="sm"
              >
                <FileSpreadsheet className="w-4 h-4 mr-2" />
                Import CSV
              </Button>
              <Button onClick={addRow} variant="outline" size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Tambah Baris
              </Button>
              <Button 
                onClick={handleImport} 
                disabled={rows.length === 0}
                className="bg-green-600 hover:bg-green-700"
                size="sm"
              >
                <Upload className="w-4 h-4 mr-2" />
                Import ke Database ({rows.length})
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {rows.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <p className="mb-2">Belum ada data. Pilih salah satu opsi:</p>
              <div className="flex gap-3 justify-center">
                <Button onClick={addRow} variant="outline" size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Input Manual
                </Button>
                <Button onClick={() => setShowImportModal(true)} variant="outline" size="sm">
                  <FileSpreadsheet className="w-4 h-4 mr-2" />
                  Import dari CSV
                </Button>
              </div>
            </div>
          ) : (
            <ScrollArea className="w-full">
              <div className="overflow-x-auto">
                <div className="min-w-max">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b bg-muted/50">
                        <th className="p-2 text-left text-sm font-medium w-12">#</th>
                        {columns.map(col => (
                          <th key={col.key} className="p-2 text-left text-sm font-medium min-w-[150px]">
                            {col.label}
                          </th>
                        ))}
                        <th className="p-2 text-left text-sm font-medium w-20">Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rows.map((row, rowIndex) => (
                        <tr key={row.id} className="border-b hover:bg-muted/30">
                          <td className="p-2 text-sm text-muted-foreground">{rowIndex + 1}</td>
                          {columns.map(col => (
                            <td key={col.key} className="p-2 relative">
                              {col.type === 'student-autocomplete' ? (
                                <div className="relative">
                                  <Input
                                    type="text"
                                    placeholder={col.placeholder || 'Ketik Stanbuk atau nama...'}
                                    value={row[col.key] || ''}
                                    onChange={(e) => {
                                      setSearchTerm(e.target.value);
                                      setShowAutocomplete({ rowIndex, columnKey: col.key });
                                      updateCell(rowIndex, col.key, e.target.value);
                                    }}
                                    onFocus={() => {
                                      setShowAutocomplete({ rowIndex, columnKey: col.key });
                                      if (row[col.key]) {
                                        setSearchTerm(row[col.key]);
                                      }
                                    }}
                                    className="text-sm"
                                  />
                                  {showAutocomplete?.rowIndex === rowIndex && 
                                   showAutocomplete?.columnKey === col.key && 
                                   (searchTerm || row[col.key]) && 
                                   filteredStudents.length > 0 && (
                                    <Card className="absolute z-50 mt-1 w-80 max-h-60 overflow-y-auto shadow-lg border-2 border-blue-200">
                                      <CardContent className="p-0">
                                        {filteredStudents.map(student => (
                                          <button
                                            key={student.stanbuk}
                                            className="w-full text-left p-3 hover:bg-blue-50 dark:hover:bg-blue-900/30 border-b last:border-b-0 transition-colors"
                                            onClick={() => selectStudent(rowIndex, student)}
                                          >
                                            <div className="flex items-center justify-between">
                                              <div className="flex-1">
                                                <p className="font-semibold text-sm text-blue-700 dark:text-blue-300">
                                                  {student.stanbuk} - {student.name}
                                                </p>
                                                <p className="text-xs text-muted-foreground mt-1">
                                                  {student.class} • {student.room}
                                                </p>
                                              </div>
                                              <Badge variant="outline" className="text-xs ml-2">
                                                {student.gender === 'L' ? 'L' : 'P'}
                                              </Badge>
                                            </div>
                                          </button>
                                        ))}
                                      </CardContent>
                                    </Card>
                                  )}
                                </div>
                              ) : col.type === 'select' ? (
                                <select
                                  value={row[col.key] || ''}
                                  onChange={(e) => updateCell(rowIndex, col.key, e.target.value)}
                                  className="w-full p-2 text-sm border rounded"
                                >
                                  <option value="">Pilih...</option>
                                  {col.options?.map(opt => (
                                    <option key={opt} value={opt}>{opt}</option>
                                  ))}
                                </select>
                              ) : (
                                <Input
                                  type={col.type}
                                  placeholder={col.placeholder || ''}
                                  value={row[col.key] || ''}
                                  onChange={(e) => updateCell(rowIndex, col.key, e.target.value)}
                                  className="text-sm"
                                />
                              )}
                            </td>
                          ))}
                          <td className="p-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteRow(rowIndex)}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </ScrollArea>
          )}

          {rows.length > 0 && (
            <div className="mt-4 flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Total: {rows.length} baris data
              </p>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    if (confirm('Hapus semua data yang belum diimpor?')) {
                      setRows([]);
                    }
                  }}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Hapus Semua
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      <DataImportModal
        isOpen={showImportModal}
        onClose={() => setShowImportModal(false)}
        onImport={handleImportFromModal}
        dataType={dataType}
      />
    </>
  );
}