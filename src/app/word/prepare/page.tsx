"use client";

import { useConfig } from "@/contexts/ConfigContext";
import { useSelectedWords } from "@/contexts/SelectedWordsContext";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {
  Box,
  Button,
  Divider,
  List,
  ListItem,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function PreparePage() {
  const router = useRouter();
  const { selectedWords } = useSelectedWords();
  const { config, setConfig } = useConfig();

  useEffect(() => {
    if (selectedWords.length === 0) {
      router.push("/");
    }
  }, [selectedWords, router]);

  const handleConfigChange =
    (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
      setConfig({
        ...config,
        [field]: Number(event.target.value),
      });
    };

  return (
    <Box sx={{ p: 2 }}>
      <Box
        sx={{ display: "flex", gap: 2, mb: 2, justifyContent: "space-between" }}
      >
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => router.back()}
          variant="outlined"
        >
          Back
        </Button>
        <Button variant="contained" onClick={() => router.push("/word/player")}>
          Next
        </Button>
      </Box>

      <Typography variant="h5" gutterBottom>
        Selected words ({selectedWords.length})
      </Typography>
      <List>
        {selectedWords.map((word) => (
          <ListItem key={word.id} sx={{ mb: 2 }}>
            <Paper sx={{ p: 2, width: "100%" }}>
              <Typography variant="h6" gutterBottom>
                {word.word}
              </Typography>
              <Typography color="text.secondary" gutterBottom>
                {word.ipa}
              </Typography>
              <Typography variant="body1">{word.meaning}</Typography>
            </Paper>
          </ListItem>
        ))}
      </List>
      <Divider />
      <Typography variant="h5" gutterBottom>
        Config
      </Typography>
      <Box
        sx={{ display: "flex", flexDirection: "column", gap: 2, maxWidth: 400 }}
      >
        <TextField
          label="Word Repeat"
          type="number"
          value={config.wordRepeat}
          onChange={handleConfigChange("wordRepeat")}
          fullWidth
        />
        <TextField
          label="Delay Between Words (ms)"
          type="number"
          value={config.delayBetweenWords}
          onChange={handleConfigChange("delayBetweenWords")}
          fullWidth
        />
      </Box>
    </Box>
  );
}
