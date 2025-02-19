"use client";

import { SlideTransition } from "@/components/SlideTransition";
import { useConfig } from "@/contexts/ConfigContext";
import { useSelectedWords } from "@/contexts/SelectedWordsContext";
import { useWordPlayer } from "@/hooks/useWordPlayer";
import { Box, Typography, Button } from "@mui/material";
import Grid from "@mui/material/Grid2";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function PlayerPage() {
  const router = useRouter();
  const { selectedWords } = useSelectedWords();

  useEffect(() => {
    if (selectedWords.length === 0) {
      router.push("/");
    }
  }, [selectedWords, router]);

  const [isStarted, setIsStarted] = useState(false);
  const { config } = useConfig();

  const { currentWord } = useWordPlayer({
    words: selectedWords,
    wordRepeat: config.wordRepeat,
    delayBetweenWords: config.delayBetweenWords,
    enabled: isStarted,
  });

  const handleStart = async () => {
    setIsStarted(true);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(to bottom right, #3b82f6, #9333ea)",
        padding: 4,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
      }}
    >
      {!isStarted ? (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Typography variant="h4" sx={{ color: "white", mb: 2 }}>
            Click to start
          </Typography>
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={handleStart}
            sx={{
              width: 200,
              height: 200,
              borderRadius: "50%",
              fontSize: "1.5rem",
            }}
          >
            Start
          </Button>
        </Box>
      ) : currentWord ? (
        <SlideTransition key={currentWord.word}>
          <Box sx={{ p: 4 }}>
            <Grid container spacing={40} alignItems="center">
              <Grid
                size={6}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                {currentWord.imageUrl ? (
                  <Image
                    src={currentWord.imageUrl}
                    alt="word-img"
                    width={700}
                    height={550}
                  />
                ) : null}
              </Grid>
              <Grid
                size={6}
                sx={{
                  color: "white",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  flexDirection: "column",
                  gap: 3,
                }}
              >
                <Typography variant="h1" fontWeight="bold" gutterBottom>
                  {currentWord.word}
                </Typography>
                <Typography variant="h3" gutterBottom sx={{ color: "#ffA500" }}>
                  {currentWord.ipa}
                </Typography>
                <Typography variant="h2" fontWeight="bold" gutterBottom>
                  {currentWord.meaning}
                </Typography>
              </Grid>
            </Grid>
          </Box>
        </SlideTransition>
      ) : null}
    </Box>
  );
}
