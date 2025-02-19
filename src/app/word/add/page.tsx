"use client";

import { useCreateWord } from "@/hooks/useCreateWord";
import { useFileUpload } from "@/hooks/useFileUpload";
import {
  Box,
  Button,
  Snackbar,
  Stack,
  TextField,
  Typography,
  IconButton,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { ChangeEvent, useEffect, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

export default function AddWordPage() {
  const createWord = useCreateWord();
  const imageUpload = useFileUpload();
  const audioUpload = useFileUpload();
  const [formData, setFormData] = useState({
    word: "",
    meaning: "",
    ipa: "",
  });
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [audio, setAudio] = useState<File | null>(null);
  const [audioPreview, setAudioPreview] = useState<string>("");
  const [openToast, setOpenToast] = useState(false);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0];
      setImage(file);
      const url = URL.createObjectURL(file);
      setImagePreview(url);
    }
  };

  const handleAudioChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0];
      setAudio(file);
      const url = URL.createObjectURL(file);
      setAudioPreview(url);
    }
  };

  useEffect(() => {
    return () => {
      // Cleanup object URLs when component unmounts or files change
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
      if (audioPreview) {
        URL.revokeObjectURL(audioPreview);
      }
    };
  }, [imagePreview, audioPreview]);

  const resetForm = () => {
    setFormData({
      word: "",
      meaning: "",
      ipa: "",
    });
    setImage(null);
    setImagePreview("");
    setAudio(null);
    setAudioPreview("");
  };

  const handleSubmit = async () => {
    try {
      if (!image || !audio) {
        return;
      }

      const [imageResult, audioResult] = await Promise.all([
        imageUpload.mutateAsync({ file: image, filename: formData.word }),
        audioUpload.mutateAsync({ file: audio, filename: formData.word }),
      ]);

      await createWord.mutateAsync({
        ...formData,
        imageUrl: imageResult.path,
        audioUrl: audioResult.path,
      });

      setOpenToast(true);
      resetForm();
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const handleCloseToast = () => {
    setOpenToast(false);
  };

  return (
    <Box sx={{ p: 4, maxWidth: 600, mx: "auto" }}>
      <Typography variant="h4" sx={{ mb: 4 }}>
        Add New Word
      </Typography>
      <Stack spacing={3}>
        <TextField
          label="Word"
          name="word"
          value={formData.word}
          onChange={handleInputChange}
          fullWidth
        />
        <TextField
          label="Meaning"
          name="meaning"
          value={formData.meaning}
          onChange={handleInputChange}
          multiline
          rows={3}
          fullWidth
        />
        <TextField
          label="IPA"
          name="ipa"
          value={formData.ipa}
          onChange={handleInputChange}
          fullWidth
        />
        <Button component="label" variant="outlined" fullWidth>
          Upload Image
          <VisuallyHiddenInput
            type="file"
            accept="image/*"
            onChange={handleImageChange}
          />
        </Button>
        {imagePreview && (
          <Box
            component="img"
            src={imagePreview}
            alt="Preview"
            sx={{
              width: "100%",
              maxHeight: 200,
              objectFit: "contain",
              borderRadius: 1,
            }}
          />
        )}
        <Button component="label" variant="outlined" fullWidth>
          Upload Audio
          <VisuallyHiddenInput
            type="file"
            accept="audio/*"
            onChange={handleAudioChange}
          />
        </Button>
        {audioPreview && (
          <Box sx={{ width: "100%" }}>
            <audio controls style={{ width: "100%" }}>
              <source src={audioPreview} type="audio/mpeg" />
              Your browser does not support the audio element.
            </audio>
          </Box>
        )}
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          fullWidth
          disabled={
            imageUpload.isPending ||
            audioUpload.isPending ||
            createWord.isPending
          }
        >
          {imageUpload.isPending ||
          audioUpload.isPending ||
          createWord.isPending
            ? "Adding..."
            : "Add Word"}
        </Button>
      </Stack>
      <Snackbar
        open={openToast}
        autoHideDuration={3000}
        onClose={handleCloseToast}
        message="Word added successfully!"
        action={
          <IconButton
            size="small"
            aria-label="close"
            color="inherit"
            onClick={handleCloseToast}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        }
      />
    </Box>
  );
}
