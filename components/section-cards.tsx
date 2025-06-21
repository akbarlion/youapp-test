"use client"

import React, { useState, useEffect } from "react"
import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "./ui/button"
import { CalendarIcon, PencilIcon, UserIcon } from "lucide-react"
import axios from "axios"
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { Calendar } from "./ui/calendar"
import Link from "next/link"

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  gender: z.enum(["Male", "Female", "Other"]),
  birthday: z.string().min(1, "Birthday is required"),
  height: z.string().min(1, "Height is required"),
  weight: z.string().min(1, "Weight is required"),
  profileImage: z.any().optional(),
});

type FormData = z.infer<typeof formSchema>


export function SectionCards() {
  const [username, setUsername] = useState<string>("")
  const [loading, setLoading] = useState<boolean>(true)
  const [isAboutExpanded, setIsAboutExpanded] = useState<boolean>(false);
  const [interestData, setInterestData] = useState<string[]>([]);
  const [error, setError] = useState<string>("")
  const [success, setSuccess] = useState<boolean>(false)
  const [formLoading, setFormLoading] = useState<boolean>(false)
  const [date, setDate] = React.useState<Date>()
  const [imagePreview, setImagePreview] = useState<string | undefined>();

  const [profileData, setProfileData] = useState<{
    birthday?: string;
    horoscope?: string;
    zodiac?: string;
    height?: string;
    weight?: string;
  } | null>(null);



  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isValid },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    mode: "onChange"
  })

  useEffect(() => {
    const token = localStorage.getItem("token")

    if (token) {
      const fetchUser = async () => {
        try {
          setLoading(true)
          const response = await axios.get("https://techtest.youapp.ai/api/getProfile", {
            headers: {
              "x-access-token": token
            }
          })
          setUsername(response.data.data?.username || response.data.username || "user")

          // Set profile data
          if (response.data.data) {
            setProfileData({
              birthday: response.data.data.birthday,
              horoscope: response.data.data.horoscope,
              zodiac: response.data.data.zodiac,
              height: response.data.data.height,
              weight: response.data.data.weight
            });

            // Set interest data if available
            if (response.data.data.interests && Array.isArray(response.data.data.interests)) {
              setInterestData(response.data.data.interests);
            }
          }
        } catch (err) {
          console.error("Failed to fetch user data", err)
          setUsername("user")
        } finally {
          setLoading(false)
        }
      }

      fetchUser()
    } else {
      setUsername("guest")
      setLoading(false)
    }
  }, [])

  const onSubmit = async (data: FormData) => {
    setFormLoading(true)
    setError("")
    setSuccess(false)

    try {
      const token = localStorage.getItem("token")

      if (!token) {
        setError("Authentication required")
        return
      }

      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('gender', data.gender);
      formData.append('birthday', data.birthday);
      formData.append('height', data.height);
      formData.append('weight', data.weight);

      if (data.profileImage) {
        formData.append('profileImage', data.profileImage);
      }

      await axios.put("https://techtest.youapp.ai/api/updateProfile", formData, {
        headers: {
          "x-access-token": token,
          "Content-Type": "multipart/form-data"
        }
      });

      setSuccess(true)
      setTimeout(() => {
        setIsAboutExpanded(false)
      }, 1500)
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.data?.message) {
        setError(err.response.data.message)
      } else {
        setError("Failed to update profile")
      }
    } finally {
      setFormLoading(false)
    }
  }


  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      <Card className="@container/card relative overflow-hidden">
        {imagePreview && (
          <div
            className="absolute inset-0 w-full h-full bg-cover bg-center z-0 opacity-40"
            style={{ backgroundImage: `url(${imagePreview})` }}
          />
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10" />

        <div className="relative z-20">
          <CardHeader>
            <CardAction>
              <Button size="icon" className="size-8">
                <PencilIcon />
              </Button>
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-md">
            <div className="line-clamp-1 flex gap-2 font-medium mt-3">
              {loading ? "..." : `Welcome back @${username}!`}
            </div>
          </CardFooter>
        </div>
      </Card>


      <Card className="@container/card">
        <CardHeader>
          <CardTitle>About</CardTitle>
          <CardAction>
            {isAboutExpanded ? (
              <Button
                className="bg-card text-gradient-yellow"
                variant={"ghost"}
                onClick={handleSubmit(onSubmit)}
                disabled={formLoading || !isValid}
              >
                {formLoading ? (
                  <div className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Updating...</span>
                  </div>
                ) : "Save & Update"}
              </Button>
            ) : (
              <Button
                size={'icon'}
                className="size-8"
                onClick={() => setIsAboutExpanded(!isAboutExpanded)}
              >
                <PencilIcon />
              </Button>
            )}
          </CardAction>
        </CardHeader>

        {isAboutExpanded ? (
          <CardContent className="pt-0">
            {error && <div className="text-red-500 text-sm">{error}</div>}
            {success && <div className="text-green-500 text-sm">Profile updated successfully!</div>}
            <form className="space-y-4">
              <div className="grid grid-cols-12 items-center gap-2 mb-6">
                <Label className="col-span-5">Profile Photo:</Label>
                <div className="col-span-7">
                  <div className="flex flex-col items-center">
                    <div className="relative w-24 h-24 mb-2 overflow-hidden rounded-full bg-muted">
                      {imagePreview ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={imagePreview}
                          alt="Profile"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="flex items-center justify-center w-full h-full text-muted-foreground">
                          <UserIcon className="w-8 h-8" />
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <label htmlFor="image-upload" className="cursor-pointer">
                        <div className="px-3 py-1 text-xs bg-primary text-white rounded-md hover:bg-primary/90">
                          Upload
                        </div>
                        <input
                          id="image-upload"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onload = (e) => {
                                setImagePreview(e.target?.result as string);
                                setValue('profileImage', file);
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                        />
                      </label>
                      {imagePreview && (
                        <button
                          type="button"
                          onClick={() => {
                            setImagePreview(undefined);
                            setValue('profileImage', undefined);
                          }}
                          className="px-3 py-1 text-xs bg-destructive text-white rounded-md hover:bg-destructive/90"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-12 items-center gap-2">
                <Label className="col-span-5">Display name:</Label>
                <div className="col-span-7 w-full">
                  <Input placeholder="Enter name" {...register('name')} />
                  {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
                </div>
              </div>

              <div className="grid grid-cols-12 items-center gap-2">
                <Label className="col-span-5">Gender:</Label>
                <div className="col-span-7">
                  <Select onValueChange={(value) => setValue('gender', value as 'Male' | 'Female' | 'Other')}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select Gender" />
                    </SelectTrigger>
                    <SelectContent className="bg-card text-white dark">
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.gender && <p className="text-red-500 text-xs mt-1">{errors.gender.message}</p>}
                </div>
              </div>


              <div className="grid grid-cols-12 items-center gap-2">
                <Label className="col-span-5">Birthday:</Label>
                <div className="col-span-7 w-full">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal bg-card",
                          !date && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 bg-card" align="start">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={(selectedDate) => {
                          setDate(selectedDate);
                          if (selectedDate) {
                            setValue('birthday', format(selectedDate, 'yyyy-MM-dd'), { shouldValidate: true });
                          }
                        }}
                        className="text-white"
                        classNames={{
                          day_selected: "bg-white text-primary-foreground hover:bg-white hover:text-primary-foreground focus:bg-white focus:text-black",
                        }}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <div className="grid grid-cols-12 items-center gap-2">
                <Label className="col-span-5">Height:</Label>
                <div className="col-span-7 relative">
                  <Input placeholder="Add height" {...register('height')} className="pr-8" />
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">cm</span>
                  {errors.height && <p className="text-red-500 text-xs mt-1">{errors.height.message}</p>}
                </div>
              </div>

              <div className="grid grid-cols-12 items-center gap-2">
                <Label className="col-span-5">Weight:</Label>
                <div className="col-span-7 relative">
                  <Input placeholder="Add weight" {...register('weight')} className="pr-8" />
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">kg</span>
                  {errors.weight && <p className="text-red-500 text-xs mt-1">{errors.weight.message}</p>}
                </div>
              </div>
            </form>
          </CardContent>
        ) : (
          <CardFooter className="flex-col items-start gap-1.5 text-md">
            {profileData &&
              profileData.birthday !== 'Error' &&
              profileData.horoscope !== 'Error' &&
              profileData.zodiac !== 'Error' &&
              profileData.height !== 'Error' &&
              profileData.weight !== 'Error' ? (
              <div className="w-full space-y-2">
                {profileData.birthday && profileData.birthday !== 'Error' && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Birthday:</span>
                    <span>{profileData.birthday}</span>
                  </div>
                )}
                {profileData.horoscope && profileData.horoscope !== 'Error' && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Horoscope:</span>
                    <span>{profileData.horoscope}</span>
                  </div>
                )}
                {profileData.zodiac && profileData.zodiac !== 'Error' && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Zodiac:</span>
                    <span>{profileData.zodiac}</span>
                  </div>
                )}
                {profileData.height && profileData.height !== 'Error' && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Height:</span>
                    <span>{profileData.height} cm</span>
                  </div>
                )}
                {profileData.weight && profileData.weight !== 'Error' && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Weight:</span>
                    <span>{profileData.weight} kg</span>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-muted-foreground">
                Add in your your to help others know you better
              </div>
            )}
          </CardFooter>
        )}
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardTitle>Interest</CardTitle>
          <CardAction>
            <Button asChild size={'icon'} className="size-8">
              <Link href='/interest'>
                <PencilIcon />
              </Link>
            </Button>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-md">
          {interestData && interestData.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {interestData.map((interest, index) => (
                <div key={index} className="bg-[#FFFFFF1A] px-3 py-1 flex items-center gap-1">
                  <span>{interest}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-muted-foreground">
              Add in your interest to find a better match
            </div>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}