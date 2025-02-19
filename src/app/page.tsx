"use client";

import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { useGetWords } from "@/hooks/useGetWords";
import Image from "next/image";
import { useState } from "react";
import { useSelectedWords } from "@/contexts/SelectedWordsContext";

export default function Home() {
  const router = useRouter();
  const { data: words, isLoading } = useGetWords();
  const [search, setSearch] = useState("");
  const [showSelectedOnly, setShowSelectedOnly] = useState(false);
  const { toggleWordSelection, isWordSelected, selectedWords } =
    useSelectedWords();

  if (isLoading) {
    return null;
  }

  const filteredWords = words?.filter(
    (word) =>
      word.word.toLowerCase().includes(search.toLowerCase()) &&
      (!showSelectedOnly || isWordSelected(word.id))
  );

  return (
    <Box sx={{ p: 2 }}>
      <Box
        sx={{
          display: "flex",
          mb: 2,
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
          <TextField
            label="Search words"
            variant="outlined"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            size="small"
          />
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={showSelectedOnly}
                  onChange={(e) => setShowSelectedOnly(e.target.checked)}
                />
              }
              label="Show selected only"
            />
          </Box>
          <Button onClick={() => router.push("/word/add")} variant="contained">
            Add word
          </Button>
        </Box>
        <Button
          onClick={() => router.push("/word/prepare")}
          variant="contained"
          disabled={!selectedWords.length}
        >
          Next
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox"></TableCell>
              <TableCell>Word</TableCell>
              <TableCell>Definition</TableCell>
              <TableCell>IPA</TableCell>
              <TableCell>Image</TableCell>
              <TableCell>Audio</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredWords?.map((word) => (
              <TableRow key={word.id}>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={isWordSelected(word.id)}
                    onChange={() => toggleWordSelection(word)}
                  />
                </TableCell>
                <TableCell>{word.word}</TableCell>
                <TableCell>{word.meaning}</TableCell>
                <TableCell>{word.ipa}</TableCell>
                <TableCell>
                  <Box
                    sx={{
                      position: "relative",
                      height: "60px",
                      width: "fit-content",
                    }}
                  >
                    {word.imageUrl ? (
                      <Image
                        alt="word-img"
                        src={word.imageUrl}
                        width={0}
                        height={0}
                        sizes="100vh"
                        style={{ height: "100%", width: "auto" }}
                      />
                    ) : null}
                  </Box>
                </TableCell>
                <TableCell>
                  {word.audioUrl ? (
                    <audio controls style={{ width: 200, height: 40 }}>
                      <source src={word.audioUrl} type="audio/mpeg" />
                      Your browser does not support the audio element.
                    </audio>
                  ) : null}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
