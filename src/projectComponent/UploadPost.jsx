import { useState, useEffect, useRef } from "react"
import { Button } from "../components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog"
import { Field, FieldGroup } from "../components/ui/field"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { Camera, Upload, ImagePlus, Image, Plus, Loader2, FileInput, X } from "lucide-react"
import { toast } from "sonner"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectSeparator, SelectTrigger, SelectValue } from "@/components/ui/select"
import { usePosts } from "../context/PostContext.jsx"
import { useUser } from "@/context/UserContext.jsx"


function UploadPost (){
    const [description, setDescription] = useState("")
    const [visibility, setVisibility] = useState("")
    const [imageFile, setImageFile] = useState(null)
    const [loading, setLoading] = useState(false)
    // const fileInputRef = useRef(null)
    const { fetchPosts, setPostsLoaded, setPosts } = usePosts()
    const [imageFiles, setImageFiles] = useState([]);   // array of File objects
    const [previews, setPreviews] = useState([]);        // array of object URLs
    const [open, setOpen] = useState(false)
    // const { user } = useUser();
    const baseURL = import.meta.env.VITE_BASE_URL

    useEffect(() => {
        return () => previews.forEach(url => URL.revokeObjectURL(url));
    }, [previews]);


    const handleFileChange = (e) => {
        const selected = Array.from(e.target.files);          // FileList → array
        const merged = [...imageFiles, ...selected];          // keep previously picked files

        // Optionally cap at e.g. 5 images
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
        setLoading(true)
        try {
           const formData = new FormData()
           formData.append("description", description)
           formData.append("visibility", visibility)
           imageFiles.forEach(file => formData.append("images", file));
         const response = await fetch (`${baseURL}/post/create`, {
            method: "POST",
            credentials: "include",
            body: formData
        })

        const data = await response.json()
        // console.log(data)

        if (response.ok) {
            toast.success(data.message);
            setPosts(prev => [...prev, data.post])
            // console.log(data.post)
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
    }

    // const handleClear = (e) => {
    //     e.target.value = ""
    // }

    useEffect(() => {
        fetchPosts();
    }, []);

    return(
        <div className="absolute inset-0 sticky bottom-15 px-5 md:bottom-5">
            <Dialog open={open} onOpenChange={setOpen} className="px-5">
                
                    <DialogTrigger style={{ boxShadow: "0 6px 35px 5px rgba(168, 85, 247, 0.7)" }} className="h-[55px] w-[55px] rounded-[50px] cursor-pointer bg-purple-500 absolute bottom-0 right-3 grid place-content-center ">
                        <Plus className="!w-7 !h-7 text-white" />
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
                    multiple                          // <-- key attribute
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
    );
}
export default UploadPost