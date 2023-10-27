import barcode as b
from barcode.writer import ImageWriter

my_code = b.Code39('', writer= ImageWriter())
my_code.save("./barcode")