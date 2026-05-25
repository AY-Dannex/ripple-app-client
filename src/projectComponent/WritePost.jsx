import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Select, SelectContent, SelectGroup, SelectItem,
  SelectLabel, SelectTrigger, SelectValue
} from "@/components/ui/select";
import { toast } from "sonner";
import { useUser } from "../context/UserContext";
import { ImagePlus, X, Plus, Waves } from "lucide-react";
import { usePosts } from "../context/PostContext";
import { Loader2 } from "lucide-react";
import pic from "../assets/pic.jpg";
import { Field, FieldGroup } from "../components/ui/field";
import { Label } from "../components/ui/label";
import {
  Dialog, DialogClose, DialogContent, DialogDescription,
  DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "../components/ui/dialog";

function WritePost() {
  const [description, setDescription] = useState("");
  const [visibility, setVisibility] = useState("");
  const [loading, setLoading] = useState(false);
  const [imageFiles, setImageFiles] = useState([]);   
  const [previews, setPreviews] = useState([]);     
  const { user } = useUser();
  const { fetchPosts, posts, setPosts } = usePosts();
   const [open, setOpen] = useState(false)
  const baseURL = import.meta.env.VITE_BASE_URL

  // Revoke object URLs on unmount to avoid memory leaks
  useEffect(() => {
    return () => previews.forEach(url => URL.revokeObjectURL(url));
  }, [previews]);

  const handleFileChange = (e) => {
    const selected = Array.from(e.target.files);          
    const merged = [...imageFiles, ...selected];          

    // Optionally cap at e.g. 4 images
    if (merged.length > 4) {
      toast.error("You can upload at most 4 images.");
      return;
    }

    setImageFiles(merged);
    setPreviews(merged.map(file => URL.createObjectURL(file)));
    e.target.value = "";  // reset input so same file can be re-added after removal
  };

  const removeImage = (index) => {
    URL.revokeObjectURL(previews[index]);          // free memory
    setImageFiles(prev => prev.filter((_, i) => i !== index));
    setPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handlePost = async () => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("description", description);
      formData.append("visibility", visibility);

      // Append each file under the same key — multer's .array("images") will receive them all
      imageFiles.forEach(file => formData.append("images", file));

      const response = await fetch(`${baseURL}/post/create`, {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(data.message);
        setPosts(prev => [...prev, data.post]) 
        setOpen(false)    
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
      setDescription("");
      setVisibility("");
      setImageFiles([]);
      setPreviews([]);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);  

  return (
    <div className="px-2 pb-2 sm:px-5 sticky top-0 bg-white z-10">
      <div className="flex gap-5 py-2 justify-between items-center sm:gap-30">
        <div className="flex gap-2 items-center md:hidden">
          <Waves size={25} className="text-purple-500" />
          <h1 className="font-bold text-xl tracking-tight">Ripple</h1>
        </div>
        <div className="flex items-center gap-2 w-[100%]">
          <Dialog  open={open} onOpenChange={setOpen} >
            <DialogTrigger className="w-[100%]">
              <div className="border pl-5 py-2 rounded-2xl cursor-pointer w-[100%]">
                <p className="text-sm text-left">What's on your mind?</p>
              </div>
            </DialogTrigger>

            <DialogContent className="!max-w-[600px]">
              <DialogHeader>
                <DialogTitle>What's on your mind</DialogTitle>
                <DialogDescription>
                  Upload photos or write something to share with your audience.
                </DialogDescription>
              </DialogHeader>
              <FieldGroup>
                <div className="flex items-center gap-2 mt-[-15px]">
                    {previews.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {previews.map((src, i) => (
                          <div key={i} className="relative w-10 h-10">
                            <img
                              src={src}
                              alt={`preview-${i}`}
                              className="w-full h-full object-cover rounded-lg"
                            />
                            {/* Remove button */}
                            <button
                              type="button"
                              onClick={() => removeImage(i)}
                              className="absolute -top-1 -right-1 bg-black/70 rounded-full p-0.5 text-white hover:bg-black"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  <div className="relative flex gap-3 items-center justify-center cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      multiple                     
                      disabled={loading}
                      onChange={handleFileChange}
                      className="absolute inset-0 opacity-0 cursor-pointer z-10"
                      id="upload"
                    /> <br />
                    <label htmlFor="upload" className="cursor-pointer">
                      <div className="w-fit h-10 mt-2 flex gap-2 px-2 items-center bg-gray-100 rounded-lg">
                        <Plus size={30} />
                      </div>
                    </label>
                  </div>
                </div>

                {/* Image previews */}

                <Field>
                  <Label htmlFor="description">Description</Label>
                  <textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    disabled={loading}
                    className="p-2 border border-purple-400 outline-purple-400 rounded-lg resize-none h-20 w-full"
                  />
                </Field>
              </FieldGroup>

              <Select value={visibility} disabled={loading} onValueChange={setVisibility}>
                    <SelectTrigger className="w-full max-w-35">
                      <SelectValue placeholder="Select visibility" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Visibility</SelectLabel>
                        <SelectItem value="public">Public</SelectItem>
                        <SelectItem value="private">Private</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>

              <DialogFooter className="flex flex-row justify-end">
                <DialogClose>
                  <Button className="cursor-pointer border-purple-500 text-purple-500 bg-transparent">
                    Cancel
                  </Button>
                </DialogClose>
                <Button
                  type="button"
                  onClick={handlePost}
                  className="cursor-pointer bg-purple-500 w-20"
                >
                  {loading ? <Loader2 className="animate-spin" /> : "Upload"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
}

export default WritePost;