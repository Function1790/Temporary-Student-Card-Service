from barcode import Code128
from barcode.writer import ImageWriter

my_code = Code128('9788931461534', writer= ImageWriter())
my_code.save("./barcode")