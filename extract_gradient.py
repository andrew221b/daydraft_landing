import sys
from PIL import Image

def extract_gradient(image_path):
    # Open image
    img = Image.open(image_path).convert("RGBA")
    w, h = img.size
    
    # We want to sample colors along a vertical line near the center 
    # of the left stem of the "D" or the average color of each row.
    # Let's just calculate the average color of non-transparent pixels 
    # for each row to build a robust vertical gradient!
    
    row_colors = []
    
    for y in range(h):
        r_sum, g_sum, b_sum, count = 0, 0, 0, 0
        for x in range(w):
            r, g, b, a = img.getpixel((x, y))
            # Only count mostly opaque pixels to avoid edge blending with transparency
            if a > 200:
                r_sum += r
                g_sum += g
                b_sum += b
                count += 1
        
        if count > 0:
            row_colors.append((y, int(r_sum/count), int(g_sum/count), int(b_sum/count)))
            
    if not row_colors:
        print("No opaque pixels found!")
        sys.exit(1)
        
    # The first row with color is 0%, the last is 100%
    min_y = row_colors[0][0]
    max_y = row_colors[-1][0]
    height = max_y - min_y
    
    # Let's sample 5 key points: 0%, 25%, 50%, 75%, 100%
    percentages = [0, 25, 50, 75, 100]
    
    gradient_stops = []
    for p in percentages:
        target_y = min_y + (height * p / 100)
        # Find the closest row
        closest_row = min(row_colors, key=lambda row: abs(row[0] - target_y))
        _, r, g, b = closest_row
        hex_color = f"#{r:02x}{g:02x}{b:02x}"
        gradient_stops.append(f"{hex_color} {p}%")
        
    print(f"background: linear-gradient(180deg, {', '.join(gradient_stops)});")

if __name__ == "__main__":
    extract_gradient(sys.argv[1])
