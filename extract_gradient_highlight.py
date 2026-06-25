import sys
from PIL import Image

def extract_gradient(image_path):
    img = Image.open(image_path).convert("RGBA")
    w, h = img.size
    
    row_colors = []
    
    for y in range(h):
        pixels = []
        for x in range(w):
            r, g, b, a = img.getpixel((x, y))
            if a > 200:
                # Calculate perceived brightness
                brightness = (r * 299 + g * 587 + b * 114) / 1000
                pixels.append((brightness, r, g, b))
        
        if pixels:
            # Sort by brightness and take the top 10% (the highlight colors)
            pixels.sort(key=lambda x: x[0], reverse=True)
            top_pixels = pixels[:max(1, len(pixels)//10)]
            
            r_sum = sum(p[1] for p in top_pixels)
            g_sum = sum(p[2] for p in top_pixels)
            b_sum = sum(p[3] for p in top_pixels)
            count = len(top_pixels)
            
            row_colors.append((y, int(r_sum/count), int(g_sum/count), int(b_sum/count)))
            
    if not row_colors:
        print("No opaque pixels found!")
        sys.exit(1)
        
    min_y = row_colors[0][0]
    max_y = row_colors[-1][0]
    height = max_y - min_y
    
    percentages = [0, 25, 50, 75, 100]
    
    gradient_stops = []
    for p in percentages:
        target_y = min_y + (height * p / 100)
        closest_row = min(row_colors, key=lambda row: abs(row[0] - target_y))
        _, r, g, b = closest_row
        hex_color = f"#{r:02x}{g:02x}{b:02x}"
        gradient_stops.append(f"{hex_color} {p}%")
        
    print(f"background: linear-gradient(180deg, {', '.join(gradient_stops)});")

if __name__ == "__main__":
    extract_gradient(sys.argv[1])
