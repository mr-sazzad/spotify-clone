import useUploadModal from "@/hooks/useUploadModal";
import { useUser } from "@/hooks/useUser";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-hot-toast/headless";
import uniqid from "uniqid";
import Button from "./Button";
import Input from "./Input";
import Modal from "./Modal";

const UploadModal = () => {
  const uploadModel = useUploadModal();
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useUser();
  const supabaseClient = useSupabaseClient();
  const router = useRouter();

  const { register, handleSubmit, reset } = useForm<FieldValues>({
    defaultValues: {
      author: "",
      title: "",
      song: null,
      image: null,
    },
  });

  const onSubmit: SubmitHandler<FieldValues> = async (values) => {
    try {
      setIsLoading(true);
      const imageFile = values.image?.[0];
      const songFile = values.song?.[0];

      if (!imageFile || !songFile || !user) {
        toast.error("Missing field");
        return;
      }
      const uniqId = uniqid();

      // upload SongFile 💡
      const { data: songData, error: songError } = await supabaseClient.storage
        .from("songs")
        .upload(`song-${values.title}-${uniqId}`, songFile, {
          cacheControl: "3600",
          upsert: false,
        });

      if (songError) {
        setIsLoading(false);
        toast.error("Error uploading song");
      }

      if (songError) {
        setIsLoading(false);
        toast.error("Error uploading song");
      }

      // upload Image 💡
      const { data: imageData, error: imageError } =
        await supabaseClient.storage
          .from("images")
          .upload(`image-${values.title}-${uniqId}`, imageFile, {
            cacheControl: "3600",
            upsert: false,
          });

      if (imageError) {
        setIsLoading(false);
        toast.error("Error uploading image");
      }

      const { error: supabaseError } = await supabaseClient
        .from("songs")
        .insert({
          user_id: user.id,
          title: values.title,
          author: values.author,
          image_path: imageData?.path,
          song_path: songData?.path,
        });

      if (supabaseError) {
        setIsLoading(false);
        return toast.error(supabaseError.message);
      }

      router.refresh();
      setIsLoading(false);
      toast.success("Song Created");
      uploadModel.onClose();
    } catch (err: any) {
      toast.error("something went wrong");
    } finally {
      setIsLoading(false);
    }
  };
  const onChange = (open: boolean) => {
    if (!open) {
      reset();
      uploadModel.onClose();
    }
  };
  return (
    <Modal
      title="Add a song"
      description="upload an mp3 file"
      isOpen={uploadModel.isOpen}
      onChange={onChange}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <Input
          id="title"
          disabled={isLoading}
          {...register("title", { required: true })}
          placeholder="Song title"
        />
        <Input
          id="author"
          disabled={isLoading}
          {...register("author", { required: true })}
          placeholder="Song author"
        />
        <div className="flex flex-col gap-4">
          <div>
            <div className="pb-1">Select a song file</div>
            <Input
              id="song"
              type="file"
              accept=".mp3"
              disabled={isLoading}
              {...register("song", { required: true })}
            />
          </div>

          <div>
            <div className="pb-1">Select an image</div>
            <Input
              id="image"
              type="file"
              disabled={isLoading}
              accept="image/*"
              {...register("image", { required: true })}
            />
          </div>
        </div>
        <Button disabled={isLoading} type="submit">
          create
        </Button>
      </form>
    </Modal>
  );
};

export default UploadModal;
