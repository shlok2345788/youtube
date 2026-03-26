import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import CustomVideoPlayer from "@/components/CustomVideoPlayer";
import { ALL_VIDEOS } from "@/lib/data/videos";
import ChannelInfo from "@/components/ChannelInfo";
import Comments from "@/components/Comments";
import RelatedVideos from "@/components/RelatedVideo";

import { Download } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import axiosInstance from "@/lib/axiosinstance"; // Use centralized instance
import axios from "axios";
import { useUser } from "@/lib/AuthContext";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import Script from "next/script";

const VideoOpenToWatch = () => {
  const router = useRouter();
  const { id } = router.query;
  const { user, login } = useUser(); // Get user and login from context

  const [loading, setLoading] = useState(true);
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<'bronze' | 'silver' | 'gold'>('bronze');

  interface Video {
    _id: string;
    videotitle: string;
    videochanel: string;
    views: number;
    Like: number;
    filepath: string;
    thumbnailUrl?: string;
  }

  const [video, setVideo] = useState<Video | undefined>(undefined);

  const relatedVideos = ALL_VIDEOS;

  useEffect(() => {
    if (!router.isReady) {
      return;
    }

    const foundVideo = relatedVideos.find((v) => String(v._id) === String(id));

    setTimeout(() => {
      setLoading(false);
      setVideo(foundVideo);
    }, 0);
  }, [router.isReady, id, relatedVideos]);

  useEffect(() => {
    if (user && video) {
      axiosInstance.post('/user/user/data', {
         userId: user._id || user.id,
         type: 'history',
         action: 'add',
         videoId: video._id
      }).then(res => {
         if (res.data.user) {
           login(res.data.user);
         }
      }).catch(e => console.error("Failed to add to history", e));
    }
  }, [user?._id, user?.id, video?._id]);

  const handleNextVideo = () => {
    const currentIndex = relatedVideos.findIndex((v) => String(v._id) === String(id));
    if (currentIndex >= 0 && currentIndex < relatedVideos.length - 1) {
      router.push(`/watch/${relatedVideos[currentIndex + 1]._id}`);
    } else if (relatedVideos.length > 0) {
      router.push(`/watch/${relatedVideos[0]._id}`);
    }
  };

  const handleCloseVideo = () => {
    router.push("/");
  };

  const handleShowComments = () => {
    const commentsSection = document.getElementById("comments-section");
    if (commentsSection) {
      commentsSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleDownload = async () => {
    if (!user) {
      toast.error("Please sign in to download videos");
      return;
    }

    try {
      const response = await axiosInstance.post("/user/user/download", {
        userId: user._id || user.id,
        videoId: video?._id,
        videoTitle: video?.videotitle,
        videoThumbnail: video?.thumbnailUrl || "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=640&q=80",
        videoChannel: video?.videochanel
      });

      if (response.status === 200) {
        if (response.data.user) {
          login(response.data.user);
        }

        // Trigger actual download in browser
        toast.info("Preparing download...");
        try {
          const res = await fetch(video?.filepath || "/video/sample.mp4");
          if (!res.ok) throw new Error("Network response was not ok");
          const blob = await res.blob();
          const blobUrl = window.URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.style.display = "none";
          a.href = blobUrl;
          a.download = `${video?.videotitle || "video"}.mp4`;
          document.body.appendChild(a);
          a.click();
          window.URL.revokeObjectURL(blobUrl);
          document.body.removeChild(a);
          toast.success("Video saved to Downloads!");
        } catch (e) {
          console.error("Blob download failed", e);
          const a = document.createElement("a");
          a.href = video?.filepath || "/video/sample.mp4";
          a.download = `${video?.videotitle || "video"}.mp4`;
          a.target = "_blank";
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          toast.success("Video opened for download!");
        }
      }
    } catch (error: unknown) {
      const err = error as any;
      if (err?.response && err.response.status === 403) {
        setShowPremiumModal(true);
      } else {
        toast.error("Download failed. Please try again.");
        console.error(error);
      }
    }
  };

  interface RazorpayResponse {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
  }

  const handlePayment = async () => {
    try {
      const { data: order } = await axiosInstance.post("/user/payment/orders", { plan: selectedPlan });

      // Check for Mock Order (Test Mode without Keys)
      if (order.id && order.id.startsWith("order_mock_")) {
        toast.info("Test Mode: Simulating Payment...");
        setTimeout(async () => {
          try {
            const res = await axiosInstance.post("/user/payment/verify", {
              razorpay_order_id: order.id,
              razorpay_payment_id: "pay_mock_123456",
              razorpay_signature: "mock_signature",
              userId: user?._id || user?.id,
              plan: selectedPlan
            });
            if (res.data.user) {
              login(res.data.user);
            }
            toast.success("Welcome to Premium! (Test Mode)");
            setShowPremiumModal(false);
          } catch (error) {
            console.error(error);
            toast.error("Mock payment verification failed");
          }
        }, 1500);
        return;
      }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_placeholder", // Replace with env var
        amount: order.amount,
        currency: order.currency,
        name: "YourTube Premium",
        description: "Unlimited Downloads & Ad-free Experience",
        order_id: order.id,
        handler: async function (response: RazorpayResponse) {
          try {
            const res = await axiosInstance.post("/user/payment/verify", {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              userId: user?._id || user?.id,
              plan: selectedPlan
            });
            if (res.data.user) {
              login(res.data.user);
            }
            toast.success("Welcome to Premium! You can now download unlimited videos.");
            setShowPremiumModal(false);
          } catch (verifyError) {
            toast.error("Payment verification failed");
            console.error(verifyError);
          }
        },
        prefill: {
          name: user?.name,
          email: user?.email,
        },
        theme: {
          color: "#ff0000",
        },
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const rzp1 = new (window as any).Razorpay(options);
      rzp1.open();

    } catch (error) {
      console.error("Payment initiation failed:", error);
      toast.error("Could not initiate payment");
    }
  };


  if (loading) {
    return <div>Loading...</div>;
  }

  if (!video) {
    return <div>Video not found for ID: {id}</div>;
  }

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />
      <div className="bg-background text-foreground min-h-screen">
        <div className="max-w-[1700px] mx-auto flex flex-col lg:flex-row gap-6 px-0 md:px-6 lg:px-10 py-0 md:py-6">
          {/* Left Column: Video Player, Info, Comments */}
          <div className="flex-1 w-full lg:min-w-[0px]">
            <div className="w-full xl:max-h-[80vh] aspect-video sticky top-14 md:relative z-40 bg-black">
              <CustomVideoPlayer 
                video={video} 
                onLimitReached={() => setShowPremiumModal(true)} 
                onNextVideo={handleNextVideo}
                onCloseVideo={handleCloseVideo}
                onShowComments={handleShowComments}
              />
            </div>
            
            <div className="px-4 md:px-0 mt-4">
              <h1 className="text-lg md:text-xl font-bold line-clamp-2">{video.videotitle}</h1>
              
              <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-2 border-b md:border-none">
                <ChannelInfo />
                <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2 sm:pb-0">
                  <Button onClick={handleDownload} variant="secondary" className="rounded-full flex gap-2 items-center bg-secondary hover:bg-secondary/80 shrink-0">
                    <Download className="w-4 h-4" />
                    <span className="text-sm">Download</span>
                  </Button>
                  {/* Add Share, Like etc here if needed */}
                </div>
              </div>
              
              <div className="mt-4 bg-secondary/50 rounded-xl p-3 md:p-4 text-sm">
                <div className="font-bold flex gap-2 mb-1">
                  <span>{video.views.toLocaleString()} views</span>
                  <span>{formatDistanceToNow(new Date((video as any).createdAt || Date.now()))} ago</span>
                </div>
                <p className="whitespace-pre-wrap">{video.videotitle} ... more info here</p>
              </div>

              <div className="mt-6" id="comments-section">
                <Comments videoId={String(id || video?._id || "")} />
              </div>
            </div>
          </div>

          {/* Right Column: Related Videos */}
          <div className="w-full lg:w-[350px] xl:w-[400px] shrink-0 px-4 md:px-0">
            <h3 className="text-lg font-bold mb-4 hidden lg:block">Up next</h3>
            <RelatedVideos videos={relatedVideos} />
          </div>
        </div>


        {/* Premium Modal */}
        {showPremiumModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-background p-8 rounded-lg max-w-md w-full text-center relative border border-border">
              <button
                onClick={() => setShowPremiumModal(false)}
                className="absolute top-4 right-4 text-gray-500 hover:text-black"
              >
                ✕
              </button>
              <h2 className="text-2xl font-bold mb-4">Upgrade to Premium</h2>
              <p className="text-gray-600 mb-6">
                You have reached your limit. Upgrade for more watch time!
              </p>
              
              <div className="flex gap-2 mb-6">
                <div onClick={() => setSelectedPlan('bronze')} className={`cursor-pointer p-4 rounded-lg flex-1 border transition-colors ${selectedPlan === 'bronze' ? 'border-amber-600 bg-amber-50' : 'border-gray-200'}`}>
                    <p className="font-bold text-amber-700">Bronze</p>
                    <p className="font-bold text-xl">₹10</p>
                    <p className="text-xs">7 mins</p>
                </div>
                <div onClick={() => setSelectedPlan('silver')} className={`cursor-pointer p-4 rounded-lg flex-1 border transition-colors ${selectedPlan === 'silver' ? 'border-gray-500 bg-gray-100' : 'border-gray-200'}`}>
                    <p className="font-bold text-gray-700">Silver</p>
                    <p className="font-bold text-xl">₹50</p>
                    <p className="text-xs">10 mins</p>
                </div>
                <div onClick={() => setSelectedPlan('gold')} className={`cursor-pointer p-4 rounded-lg flex-1 border transition-colors ${selectedPlan === 'gold' ? 'border-yellow-500 bg-yellow-50' : 'border-gray-200'}`}>
                    <p className="font-bold text-yellow-600">Gold</p>
                    <p className="font-bold text-xl">₹100</p>
                    <p className="text-xs">Unlimited</p>
                </div>
              </div>

              <Button onClick={handlePayment} className="w-full py-6 text-lg bg-red-600 hover:bg-red-700">
                Get {selectedPlan.charAt(0).toUpperCase() + selectedPlan.slice(1)} Plan
              </Button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default VideoOpenToWatch;
