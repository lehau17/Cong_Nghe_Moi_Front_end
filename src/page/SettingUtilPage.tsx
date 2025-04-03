import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";

export default function SettingUtilPage() {
  return (
    <div className="max-w-full  p-4 space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">@ Mentions Suggestions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Mention Suggestion */}
          <div className="flex items-center justify-between p-2 rounded-md bg-white shadow">
            <div className="flex items-center space-x-3">
              <Avatar className="w-8 h-8">
                <AvatarFallback>
                  <span className="text-red-500 font-bold">@</span>
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">Mention Name Suggestion</p>
                <p className="text-sm text-gray-500">Suggest names based on content</p>
              </div>
            </div>
            <Switch defaultChecked />
          </div>

          {/* GIF Suggestion */}
          <div className="flex items-center justify-between p-2 rounded-md bg-white shadow">
            <div className="flex items-center space-x-3">
              <Avatar className="w-8 h-8">
                <AvatarFallback>
                  <span className="text-blue-500 font-bold">GIF</span>
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">Find GIF from Tenor</p>
                <p className="text-sm text-gray-500">Search keyword to find GIFs</p>
              </div>
            </div>
            <Switch defaultChecked />
          </div>

          {/* Sticker Suggestion */}
          <div className="flex items-center justify-between p-2 rounded-md bg-white shadow">
            <div className="flex items-center space-x-3">
              <Avatar className="w-8 h-8">
                <AvatarFallback>
                  <span className="text-purple-500 font-bold">😊</span>
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">Find Stickers</p>
                <p className="text-sm text-gray-500">Search keyword to find Stickers</p>
              </div>
            </div>
            <Switch defaultChecked />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
